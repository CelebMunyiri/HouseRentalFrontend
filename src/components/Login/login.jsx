import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import './Login.css'; // Import the CSS file
import { jwtDecode } from 'jwt-decode';

const publicVapidKey = 'BO0c4OtIkxbfR9s-huGIgnyI7wfV7tiW5SpgGSZdrYtQO_AuNPO02WbCjMXuVGBvy0Vdan_DbE_CLomMaO5Ir4g';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/user/login', { email, password });
      if (response.data.success) {
        setSuccess('Login successful!');
        const decodedToken = jwtDecode(response.data.token)
        localStorage.setItem('token',response.data.token)
        const role=decodedToken.role;
        const userId = decodedToken._id;
        
        setError(null); // Clear any previous error messages
        setTimeout(() => {
          if(role=='tenant'){
            subscribeUser(userId);
          navigate('/houses'); // Redirect after showing success message
          } else if(role=='landlord'){
            subscribeUser(userId);
            navigate('/landlord')
          }
        }, 1500); // Delay to show success message before redirecting
      } else {
        setError('Invalid email or password');
        setSuccess(null); // Clear success message if there is an error
      }
    } catch (err) {
      setError('Error logging in');
      setSuccess(null); // Clear success message if there is an error
    }
  };

  const subscribeUser = async (userId) => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        console.log('Registering service worker...');
        const register = await navigator.serviceWorker.register('../sw.js', {
          scope: '/',
        });
        console.log('Service worker registered.');

        // Ask the user for notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Permission denied for notifications.');
          return;
        }

        console.log('Subscribing to push notifications...');
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });
        console.log('Push subscribed.');

        // Send the subscription to the backend
        const tokenToDecode = localStorage.getItem('token')
        const theId = jwtDecode(tokenToDecode)._id
        console.log(theId)
        await saveSubscription(theId, subscription);
        console.log('Subscription saved on backend.');
      } catch (error) {
        console.error('Error during service worker registration or subscription', error);
      }
    } else {
      console.error('Push messaging is not supported');
    }
  };

  // Send subscription object to backend
  const saveSubscription = async (userId, subscription) => {
    try {
      const response = await fetch('http://localhost:3001/notification/subscribe', {
        method: 'POST',
        body: JSON.stringify({ userId, subscription }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to save subscription');
      }
      console.log(response)
    } catch (error) {
      console.error('Failed to send subscription to backend', error);
    }
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="login-options">
          <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
          <p><Link to="/forgot-password" className="link">Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
