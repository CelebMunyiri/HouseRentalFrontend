// src/components/LandlordHouses.jsx

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './LandlordHouses.css'; // Import your CSS
import { AuthContext } from '../components/AuthContext';

const LandlordHouses = () => {
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState(null);
  const { authData } = useContext(AuthContext);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/house/allhouses'
        );
        setHouses(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading houses');
      }
    };

    fetchHouses();
  }, [authData.email]);

  return (
    <div className="landlord-houses-container">
      <h2>Your Houses</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="landlord-houses-grid">
        {houses.map(house => (
          <div key={house._id} className="house-card">
            <img src={house.images[0]} alt={house.name} className="house-image" />
            <div className="house-info">
              <h3>{house.name}</h3>
              <p><strong>Location:</strong> {house.location}</p>
              <p><strong>Cost:</strong> ${house.cost}</p>
              <p><strong>Description:</strong> {house.description}</p>
              {/* Add buttons for editing or deleting if needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandlordHouses;
