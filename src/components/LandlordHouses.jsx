import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './LandlordHouses.css'; 
import { AuthContext } from '../components/AuthContext';

const LandlordHouses = () => {
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState(null);
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/house/allhouses');
        setHouses(response.data.allHouses);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading houses');
      }
    };

    fetchHouses();
  }, [authData.email]);

  const handleCreateHouse = () => {
    navigate('/house/create'); // Redirect to create house page
  };

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
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleCreateHouse} className="create-house-button">Create House</button>
    </div>
  );
};

export default LandlordHouses;
