import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3001'); // Connect to your backend server

const Chat = () => {
  const { houseId, posterId } = useParams(); // Get houseId and posterId from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId] = useState(localStorage.getItem('userId')); // Get the logged-in userId from localStorage
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false); // Track connection status
  const messageRef = useRef(null);

  const roomId = `${houseId}-${posterId}`; // Unique room ID for this chat

  useEffect(() => {
    // Listen for connection event to confirm socket connection
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to the server with socket ID:', socket.id);
    });

    // Join the chat room
    socket.emit('joinRoom', { userId, roomId });

    // Fetch previous chat messages from the backend
    const fetchMessages = async () => {
      const response = await axios.get(`http://localhost:3001/chat?sender=${userId}&receiver=${posterId}`);
      setMessages(response.data);
    };

    fetchMessages();

    // Listen for new chat messages
    socket.on('receiveMessage', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Listen for typing events
    socket.on('typing', ({ userId: typingUserId }) => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000); // Reset typing indicator after 1 second
    });

    // Cleanup when the component is unmounted
    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.emit('leaveRoom', { userId, roomId }); // Optionally notify server
      socket.disconnect(); // Disconnect from the server
    };
  }, [houseId, userId, posterId, roomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Send the message through the socket
    const messageData = {
      message: newMessage,
      sender: userId,
      receiver: posterId,
      roomId,
    };
    socket.emit('chatMessage', messageData); // Send message to the server

    setMessages((prevMessages) => [...prevMessages, messageData]); // Add message to the local state
    setNewMessage(''); // Clear the input field
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId, userId }); // Notify others that this user is typing
  };

  return (
    <div className="chat-container">
      <h2>Chat with House Poster</h2>
      <div>Connection status: {connected ? 'Connected' : 'Disconnected'}</div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === userId ? 'message-sent' : 'message-received'}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      {isTyping && <p>The user is typing...</p>}
      <div className="chat-input">
        <input
          ref={messageRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleTyping} // Notify the server when typing
          placeholder="Type your message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
