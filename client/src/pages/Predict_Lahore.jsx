import React, { useState } from 'react';
import axios from 'axios';
import { getRandomImage } from '../utils/getRandomImage.js';
import { imageData } from './fetchData.js'; // Import imageData
import { roundToNearestCrore } from '../utils/roundToNearestCrore.js'; // Import rounding function
import './style/Predict_lahore.css'; // Import your CSS file

function Predict_Lahore() {
  const [location, setLocation] = useState('');
  const [sqft, setSqft] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [baths, setBaths] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:3000/predict_lahore', {
        params: { location, sqft, bedrooms, baths },
      });
      console.log('Response from backend:', response.data);
      setPrediction(response.data.prediction);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError('Error fetching prediction. Please try again.');
      setPrediction(null); // Clear any previous prediction
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Convert prediction to crores (1 crore = 10 million)
  const predictionInCr = prediction ? parseFloat(prediction) / 100 : null;

  // Apply rounding logic to get the correct "standard" priceInCr
  const priceInCr = predictionInCr ? roundToNearestCrore(predictionInCr) : null;

  const roomArray = priceInCr ? imageData[`${priceInCr}cr`]?.rooms : [];
  const washroomArray = priceInCr ? imageData[`${priceInCr}cr`]?.washrooms : [];

  const roomImage = getRandomImage(roomArray); // Random room for predicted price
  const washroomImage = getRandomImage(washroomArray); // Random washroom for predicted price

  const additionalRoomImage = getRandomImage(roomArray); // Extra random room
  const additionalWashroomImage = getRandomImage(washroomArray); // Extra random washroom

  const locations = [
    'DHA Defence', 'Bahria Town', 'Johar Town', 'Askari', 'Wapda Town', 
    'Allama Iqbal Town', 'State Life Housing Society', 'Gulberg', 'Model Town', 
    'Cantt', 'Al Rehman Garden', 'Paragon City', 'Bahria Orchard', 'Pak Arab Housing Society', 
    'Sabzazar Scheme', 'Eden', 'Valencia Housing Society', 'DHA 11 Rahbar', 'Lalazaar Garden', 
    'Lake City', 'Samanabad', 'Gulshan-e-Ravi', 'Township', 'Military Accounts Housing Society', 
    'EME Society', 'Park View Villas', 'Lahore Medical Housing Society', 'Punjab Coop Housing Society', 
    'Canal Garden', 'PIA Housing Scheme', 'Garden Town', 'Al-Kabir Town', 'Harbanspura', 
    'Khayaban-e-Amin', 'Tariq Gardens', 'Faisal Town', 'Jubilee Town', 'Cavalry Ground', 
    'Punjab Govt Employees Society', 'Architects Engineers Housing Society'
  ];

  return (
    <div id="predict-container">
      <h1>Property Price Predictor</h1>
      <form id="predict-form" onSubmit={handleSubmit}>
        <label htmlFor="location-select">
          Location:
          <select id="location-select" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>

        <br />

          {/* Square Footage */}
          <label htmlFor="sqft-input">
          Square Footage:
          <input
            id="sqft-input"
            type="text"
            value={sqft}
            onChange={(e) => setSqft(e.target.value)}
          />
        </label>
        
        <br />
        
        {/* Bedrooms */}
        <label htmlFor="bedrooms-input">
          Bedrooms:
          <input
            id="bedrooms-input"
            type="text"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          />
        </label>
        
        <br />
        
        {/* Bathrooms */}
        <label htmlFor="baths-input">
          Bathrooms:
          <input
            id="baths-input"
            type="text"
            value={baths}
            onChange={(e) => setBaths(e.target.value)}
          />
        </label>
        
        <br />
        
        <button type="submit" disabled={loading}>
          Predict Price
        </button>
      </form>

      {error && <div id="error-message">Error: {error}</div>} {/* Display error message */}

      {prediction !== null && (
        <div id="prediction">
          <h2>Predicted Price:</h2>
          <p>Predicted Price is: {Math.ceil(prediction)} Lakhs</p>

          {roomImage && (
            <div>
              <h3>Room Image:</h3>
              <img src={roomImage} alt="Room" style={{ maxWidth: '100%', height: 'auto' }}/>
            </div>
          )}

          {washroomImage && (
            <div>
              <h3>Washroom Image:</h3>
              <img src={washroomImage} alt="Washroom" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
        </div>
      )}

      {/* Additional random room and washroom images */}
      <div id="additional-images">
        <h2>Additional Random Images:</h2>

        {additionalRoomImage && (
          <div>
            <h3>Additional Room:</h3>
            <img src={additionalRoomImage} alt="Additional Room" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        {additionalWashroomImage && (
          <div>
            <h3>Additional Washroom:</h3>
              <img src={additionalWashroomImage} alt="Additional Washroom" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Predict_Lahore;
