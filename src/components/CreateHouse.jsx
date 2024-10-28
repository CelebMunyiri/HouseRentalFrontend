// // src/components/CreateHouse.jsx

// import { useState, useContext } from 'react';
// import axios from 'axios'; // Use the configured axios instance
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../components/AuthContext';
// import './CreateHouse.css'; 
// import { jwtDecode } from 'jwt-decode';

// const CreateHouse = () => {
//   const [name, setName] = useState('');
//   const [cost, setCost] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [images, setImages] = useState(['']); // Starting with one image field
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const { authData } = useContext(AuthContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');

//     // Check if token exists
//     if (!token) {
//       setError('No token found. Please log in again.');
//       return;
//     }
//     const decodedToken=jwtDecode(token)
//       const housePoster=decodedToken._id;
//       console.log(housePoster);
//     try {
      
//       const houseData = {

//         name,
//         poster:housePoster,
//         cost: Number(cost),
//         description,
//         location,
//         images: images.filter(img => img.trim() !== '')
//       };

//       const response = await axios.post('http://localhost:3001/house/newHouse',houseData,
//       {
//         headers: {
//           token: `${token}`, // Include token in headers
//           'Content-Type': 'application/json',
//         },
//       }
//       );
      

//       if (response.data.message=="House Added succesfully") {
//         setSuccessMessage('House created successfully!');
//         setError(null);
//         // Optionally, redirect to landlord's houses page
//         navigate('/landlord');
//       } else {
//         setError(response.data.message || 'Error creating house');
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error creating house');
//       setSuccessMessage('');
//     }
//   };

//   const handleImageChange = (index, value) => {
//     const updatedImages = [...images];
//     updatedImages[index] = value;
//     setImages(updatedImages);
//   };

//   const addImageField = () => {
//     setImages([...images, '']);
//   };

//   return (
//     <div className="create-house-container">
//       <div className="create-house-box">
//         <h2>Create House</h2>
//         {error && <p className="error-message">{error}</p>}
//         {successMessage && <p className="success-message">{successMessage}</p>}
//         <form onSubmit={handleSubmit} className="create-house-form">
//           <label>
//             Name:
//             <input 
//               type="text" 
//               value={name} 
//               onChange={(e) => setName(e.target.value)} 
//               required 
//             />
//           </label>
//           <label>
//             Cost:
//             <input 
//               type="number" 
//               value={cost} 
//               onChange={(e) => setCost(e.target.value)} 
//               required 
//               min="0"
//             />
//           </label>
//           <label>
//             Description:
//             <textarea 
//               value={description} 
//               onChange={(e) => setDescription(e.target.value)} 
//               required 
//             />
//           </label>
//           <label>
//             Location:
//             <input 
//               type="text" 
//               value={location} 
//               onChange={(e) => setLocation(e.target.value)} 
//               required 
//             />
//           </label>

//           {images.map((image, index) => (
//             <label key={index}>
//               Image {index + 1}:
//               <input 
//                 type="url" 
//                 value={image} 
//                 onChange={(e) => handleImageChange(index, e.target.value)} 
//                 required 
//               />
//             </label>
//           ))}
//           <button type="button" onClick={addImageField} className="add-image-button">
//             Add Another Image
//           </button>

//           <button type="submit" className="create-house-button">Create House</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateHouse;

//
import { useState, useContext } from 'react';
import axios from 'axios'; // 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import './CreateHouse.css'; 
import { jwtDecode } from 'jwt-decode';

const CreateHouse = () => {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]); 
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState(false); 
  const navigate = useNavigate();

  const { authData } = useContext(AuthContext);

  const cloudinaryUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Notebook'); 

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dkgtf3hhj/image/upload`, 
        formData
      );
      setUploading(false);
      return response.data.secure_url; 
    } catch (err) {
      setUploading(false);
      console.error('Error uploading to Cloudinary:', err);
      setError('Error uploading image. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    const decodedToken = jwtDecode(token);
    const housePoster = decodedToken._id;

    try {
      const houseData = {
        name,
        poster: housePoster,
        cost: Number(cost),
        description,
        location,
        images, // Use the uploaded image URLs
      };

      const response = await axios.post(
        'http://localhost:3001/house/newHouse',
        houseData,
        {
          headers: {
            token: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.message === 'House Added successfully') {
        setSuccessMessage('House created successfully!');
        setError(null);
        navigate('/landlord'); // Redirect on success
      } else {
        setError(response.data.message || 'Error creating house');
        setSuccessMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating house');
      setSuccessMessage('');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await cloudinaryUpload(file);
      if (imageUrl) {
        setImages([...images, imageUrl]);
      }
    }
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

          <label>
            Upload Images:
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              disabled={uploading}
            />
            {uploading && <p>Uploading image, please wait...</p>}
          </label>

          {images.length > 0 && (
            <div className="image-preview">
              <h4>Uploaded Images:</h4>
              <ul>
                {images.map((img, index) => (
                  <li key={index}>
                    <img src={img} alt={`Uploaded ${index + 1}`} width="100" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="create-house-button">Create House</button>
        </form>
      </div>
    </div>
  );
};

export default CreateHouse;

