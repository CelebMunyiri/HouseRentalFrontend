import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import './Login.css'; // Import the CSS file
import { jwtDecode } from 'jwt-decode';

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
        
        setError(null); // Clear any previous error messages
        setTimeout(() => {
          if(role=='tenant'){
          navigate('/houses'); // Redirect after showing success message
          } else if(role=='landlord'){
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
