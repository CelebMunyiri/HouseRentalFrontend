// import React, { useState, useEffect, useRef } from 'react';
// import './chat.css'
// import io from 'socket.io-client';

// const Chat = ({ userId, roomId }) => {
//     const [socket, setSocket] = useState(null);
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//     const [typing, setTyping] = useState(false);
//     const [onlineUsers, setOnlineUsers] = useState([]);
//     const messageInputRef = useRef(null);

//     useEffect(() => {
//         // Connect to the socket.io server
//         const newSocket = io('http://localhost:3001'); // Replace with your server's URL
//         setSocket(newSocket);

//         // Join the room when connected
//         newSocket.emit('joinRoom', { userId, roomId });

//         // Listen for incoming messages
//         newSocket.on('receiveMessage', (data) => {
//             setMessages((prevMessages) => [...prevMessages, data]);
//         });

//         // Listen for typing indicators
//         newSocket.on('typing', ({ userId }) => {
//             setTyping(true);
//             setTimeout(() => setTyping(false), 2000);  // Stop showing "typing..." after 2 seconds
//         });

//         // Listen for online users
//         newSocket.on('userOnline', ({ userId }) => {
//             setOnlineUsers((prevUsers) => [...prevUsers, userId]);
//         });

//         return () => {
//             newSocket.disconnect(); // Clean up when component unmounts
//         };
//     }, [userId, roomId]);

//     // Send message
//     const sendMessage = () => {
//         if (message.trim()) {
//             const newMessage = { message, sender: userId, roomId };
//             socket.emit('chatMessage', newMessage);
//             setMessages((prevMessages) => [...prevMessages, newMessage]);
//             setMessage('');
//         }
//     };

//     // Emit typing event
//     const handleTyping = () => {
//         socket.emit('typing', { roomId, userId });
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-header">
//                 <h3>Chat Room: {roomId}</h3>
//                 <div>Online Users: {onlineUsers.length}</div>
//             </div>

//             <div className="chat-messages">
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`message ${msg.sender === userId ? 'my-message' : 'other-message'}`}>
//                         <span><strong>{msg.sender}</strong>: {msg.message}</span>
//                     </div>
//                 ))}
//                 {typing && <div className="typing">Someone is typing...</div>}
//             </div>

//             <div className="chat-input">
//                 <input
//                     type="text"
//                     placeholder="Type a message..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={handleTyping}
//                     ref={messageInputRef}
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default Chat;

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client'; // Import socket.io-client
import axios from 'axios';

const socket = io('http://localhost:3001'); // Connect to your backend server

const Chat = () => {
  const { houseId, posterId } = useParams(); // Get houseId and posterId from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId] = useState(localStorage.getItem('userId')); // Get the logged-in userId from localStorage
  const [isTyping, setIsTyping] = useState(false);
  const messageRef = useRef(null);

  const roomId = `${houseId}-${posterId}`; // Unique room ID for this chat

  useEffect(() => {
    // Join the chat room
    socket.emit('joinRoom', { userId, roomId });

    // Fetch previous chat messages from the backend
    const fetchMessages = async () => {
      const response = await axios.get(`http://localhost:3001/chat/${houseId}/${userId}/${posterId}`);
      setMessages(response.data.messages);
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



