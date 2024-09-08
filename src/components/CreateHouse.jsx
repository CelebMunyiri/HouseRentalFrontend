// src/components/CreateHouse.jsx

import { useState, useContext } from 'react';
import axios from 'axios'; // Use the configured axios instance
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import './CreateHouse.css'; // Import your CSS

const CreateHouse = () => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState(['']); // Starting with one image field
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    // Check if token exists
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
    try {
      const houseData = {
        name,
        cost: Number(cost),
        description,
        location,
        images: images.filter(img => img.trim() !== '')
      };

      const response = await axios.post('http://localhost:3001/house/newHouse',houseData,
      {
        headers: {
          token: `${token}`, // Include token in headers
          'Content-Type': 'application/json',
        },
      }
      );
      

      if (response.data.success) {
        setSuccessMessage('House created successfully!');
        setError(null);
        // Optionally, redirect to landlord's houses page
        navigate('/landlord');
      } else {
        setError(response.data.message || 'Error creating house');
        setSuccessMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating house');
      setSuccessMessage('');
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  return (
    <div className="create-house-container">
      <div className="create-house-box">
        <h2>Create House</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="create-house-form">
          <label>
            Name:
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </label>
          <label>
            Cost:
            <input 
              type="number" 
              value={cost} 
              onChange={(e) => setCost(e.target.value)} 
              required 
              min="0"
            />
          </label>
          <label>
            Description:
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </label>
          <label>
            Location:
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
            />
          </label>

          {images.map((image, index) => (
            <label key={index}>
              Image {index + 1}:
              <input 
                type="url" 
                value={image} 
                onChange={(e) => handleImageChange(index, e.target.value)} 
                required 
              />
            </label>
          ))}
          <button type="button" onClick={addImageField} className="add-image-button">
            Add Another Image
          </button>

          <button type="submit" className="create-house-button">Create House</button>
        </form>
      </div>
    </div>
  );
};

export default CreateHouse;
