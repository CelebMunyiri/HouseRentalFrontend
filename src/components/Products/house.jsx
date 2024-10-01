// import React, { useState } from 'react';
// import { useQuery } from 'react-query';
// import axios from 'axios';
// import './Houses.css';

// // Function to fetch houses data
// const fetchHouses = async () => {
//   const response = await axios.get('http://localhost:3001/house/allhouses');
//   return response.data.allHouses;
// };

// const Houses = () => {
//   const [selectedHouse, setSelectedHouse] = useState(null); // State to track selected house

//   // Use React Query's useQuery to fetch houses
//   const { data: houses = [], error, isLoading } = useQuery('houses', fetchHouses);

//   const openModal = (house) => {
//     setSelectedHouse(house); // Set selected house when a card is clicked
//   };

//   const closeModal = () => {
//     setSelectedHouse(null); // Close modal by resetting selected house
//   };

//   if (isLoading) {
//     return <p>Loading...</p>; // Display loading state
//   }

//   if (error) {
//     return <p>Error loading houses: {error.message}</p>; // Display error state
//   }

//   return (
//     <div className="houses-container">
//       <h2>Houses</h2>
//       <div className="houses-grid">
//         {houses.map(house => (
//           <div key={house._id} className="house-card" onClick={() => openModal(house)}>
//             <img src={house.images[0]} alt={house.name} className="house-image" />
//             <div className="house-info">
//               <h3>{house.name}</h3>
//               <p><strong>Location:</strong> {house.location}</p>
//               <p><strong>Cost:</strong> Ksh {house.cost}</p>
//               <p><strong>Description:</strong> {house.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal for viewing all images */}
//       {selectedHouse && (
//         <div className="modal">
//           <div className="modal-content">
//             <button className="close-button" onClick={closeModal}>X</button>
//             <h3>{selectedHouse.name}</h3>
//             <div className="image-gallery">
//               {selectedHouse.images.map((image, index) => (
//                 <img key={index} src={image} alt={`House image ${index}`} className="gallery-image" />
//               ))}
//             </div>
//             <p><strong>Location:</strong> {selectedHouse.location}</p>
//             <p><strong>Cost:</strong> Ksh {selectedHouse.cost}</p>
//             <p><strong>Description:</strong> {selectedHouse.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Houses;


//
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './Houses.css';

// Function to fetch houses data
const fetchHouses = async () => {
  const response = await axios.get('http://localhost:3001/house/allhouses');
  return response.data.allHouses;
};

const Houses = () => {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const { data: houses = [], error, isLoading } = useQuery('houses', fetchHouses);
  const navigate = useNavigate(); // Initialize navigate

  const openModal = (house) => {
    setSelectedHouse(house);
  };

  const closeModal = () => {
    setSelectedHouse(null);
  };

  const handleChatRedirect = (houseId, posterId) => {
    navigate(`/chat/${houseId}/${posterId}`); // Redirect to chat with house ID and poster ID
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading houses: {error.message}</p>;
  }

  return (
    <div className="houses-container">
      <h2>Houses</h2>
      <div className="houses-grid">
        {houses.map((house) => (
          <div key={house._id} className="house-card" onClick={() => openModal(house)}>
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

      {selectedHouse && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            <h3>{selectedHouse.name}</h3>
            <div className="image-gallery">
              {selectedHouse.images.map((image, index) => (
                <img key={index} src={image} alt={`House image ${index}`} className="gallery-image" />
              ))}
            </div>
            <p><strong>Location:</strong> {selectedHouse.location}</p>
            <p><strong>Cost:</strong> Ksh {selectedHouse.cost}</p>
            <p><strong>Description:</strong> {selectedHouse.description}</p>
            <button
              className="chat-button"
              onClick={() => handleChatRedirect(selectedHouse._id, selectedHouse.posterId)}
            >
              Chat with Poster
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Houses;

