import  { useState, useEffect } from 'react';

import axios from 'axios';

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/house/allhouses')
      .then(response =>{
         setHouses(response.data.data)
         console.log(response.data)
  })
      .catch(error => setError(error));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {error && <p>Error loading products: {error.message}</p>}
      <ul>
        {houses.map(house => (
          <li key={house._id}>
            {house.name} - Location: {house.location} - Cost: {house.cost} - Description: {house.description} 
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Houses;
