import { useState, useEffect } from 'react';
import axios from 'axios';
import './Houses.css'; // Import the CSS file

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3001/house/allhouses')
      .then((response) => {
        setHouses(response.data.allHouses);
        console.log(response.data);
      })
      .catch((error) => setError(error));
  }, []);

  return (
    <div className="houses-container">
      <h2>Products</h2>
      {error && <p>Error loading products: {error.message}</p>}
      <div className="houses-list">
        {houses.map((house) => (
          <div key={house._id} className="house-card">
            {house.images && house.images.length > 0 && (
              <img src={house.images[0]} alt={house.name} className="house-image" />
            )}
            <h3>{house.name}</h3>
            <p>Location: {house.location}</p>
            <p>Cost: {house.cost}</p>
            <p>Description: {house.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Houses;
