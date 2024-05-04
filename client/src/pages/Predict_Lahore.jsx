import React, { useState } from 'react';
import axios from 'axios';
import './style/Predict_lahore.css'; // Import your CSS file

function Predict_Lahore() {
  const [location, setLocation] = useState('');
  const [sqft, setSqft] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [baths, setBaths] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when prediction request starts
    try {
      const response = await axios.get('http://localhost:3000/predict_lahore', {
        params: { location, sqft, bedrooms, baths }
      });
      console.log('Response from backend:', response.data);
      setPrediction(response.data.prediction);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setError('Error fetching prediction. Please try again.'); // Set error message
      setPrediction(null); // Clear any previous prediction
    } finally {
      setLoading(false); // Set loading to false when prediction request ends
    }
  };
  
  const locations = [
    'DHA Defence',
    'Bahria Town',
    'Johar Town',
    'Askari',
    'Wapda Town',
    'Allama Iqbal Town',
    'State Life Housing Society',
    'Gulberg',
    'Model Town',
    'Cantt',
    'Al Rehman Garden',
    'Paragon City',
    'Bahria Orchard',
    'Pak Arab Housing Society',
    'Sabzazar Scheme',
    'Eden',
    'Valencia Housing Society',
    'DHA 11 Rahbar',
    'Lalazaar Garden',
    'Lake City',
    'Samanabad',
    'Gulshan-e-Ravi',
    'Township',
    'Military Accounts Housing Society',
    'EME Society',
    'Park View Villas',
    'Lahore Medical Housing Society',
    'Punjab Coop Housing Society',
    'Canal Garden',
    'PIA Housing Scheme',
    'Garden Town',
    'Al-Kabir Town',
    'Harbanspura',
    'Khayaban-e-Amin',
    'Tariq Gardens',
    'Faisal Town',
    'Jubilee Town',
    'Cavalry Ground',
    'Punjab Govt Employees Society',
    'Architects Engineers Housing Society'
  ];

  return (
    <div id="predict-container">
      <h1>Property Price Predictor</h1>
      <form id="predict-form" onSubmit={handleSubmit}>
        {/* Location dropdown */}
        <label htmlFor="location-select">
          Location:
          <select id="location-select" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </label>
        <br />
        {/* Square footage input */}
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
        {/* Bedrooms input */}
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
        {/* Bathrooms input */}
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
        {/* Submit button */}
        <button id="predict-button" type="submit" disabled={loading}>Predict Price</button> {/* Disable button when loading */}
      </form>
      
      {/* Display prediction */}
      {error && <div id="error-message">Error: {error}</div>}
      {prediction !== null && (
        <div id="prediction">
          <h2>Predicted Price:</h2>
          <p id="predicted-price">Predicted Price is: {prediction} Lakhs</p>
        </div>
      )}
    </div>
  );
}

export default Predict_Lahore;
