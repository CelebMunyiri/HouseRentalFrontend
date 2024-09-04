import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Registration.css'; // Import the CSS file

const Registration = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('landlord'); // Default role
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/user/register', {
        username,
        email,
        role,
        password
      });
      if (response.data.success) {
        setSuccess('Registration successful!');
        setError(null); // Clear any previous error messages
        setTimeout(() => {
          navigate('/login'); // Redirect to login after registration
        }, 1500); // Delay to show success message before redirecting
      } else {
        setError('Error registering');
        setSuccess(null); // Clear success message if there is an error
      }
    } catch (err) {
      setError('Error registering');
      setSuccess(null); // Clear success message if there is an error
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="registration-form">
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
              {/* Add more roles as needed */}
            </select>
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" className="registration-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
