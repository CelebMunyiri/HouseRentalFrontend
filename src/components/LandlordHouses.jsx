import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useQuery } from 'react-query';
import axios from 'axios';
import './LandlordHouses.css'; 
import { AuthContext } from '../components/AuthContext';

const fetchHouses = async () => {
  const response = await axios.get('http://localhost:3001/house/allhouses');
  return response.data.allHouses;
};

const LandlordHouses = () => {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  // Using React Query to fetch houses
  const { data: houses, error, isLoading } = useQuery(['houses', authData.email], fetchHouses, {
    enabled: !!authData.email, // Only fetch if email exists
  });

  const handleCreateHouse = () => {
    navigate('/house/create'); // Redirect to create house page
  };

  if (isLoading) {
    return <p>Loading houses...</p>;
  }

  if (error) {
    return <p className="error-message">{error.message || 'Error loading houses'}</p>;
  }

  return (
    <div className="landlord-houses-container">
      <h2>Your Houses</h2>
      <div className="landlord-houses-grid">
        {houses?.map(house => (
          <div key={house._id} className="house-card">
            <img src={house.images[0]} alt={house.name} className="house-image" />
            <div className="house-info">
              <h3>{house.name}</h3>
              <p><strong>Location:</strong> {house.location}</p>
              <p><strong>Cost:</strong> Ksh {house.cost}</p>
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
