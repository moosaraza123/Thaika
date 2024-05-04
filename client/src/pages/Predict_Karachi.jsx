import React, { useState } from 'react';
import axios from 'axios';
import './style/Predict_lahore.css'; // Import your CSS file

function Predict_Karachi() {
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
      const response = await axios.get('http://localhost:3000/predict_karachi', {
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
  
  const locations =[
    "DHA Defence",
    "Bahria Town Karachi",
    "Gulistan-e-Jauhar",
    "Gulshan-e-Iqbal Town",
    "Gadap Town",
    "North Karachi",
    "North Nazimabad",
    "Scheme 33",
    "Cantt",
    "Clifton",
    "Malir",
    "Jamshed Town",
    "Federal B Area",
    "Nazimabad",
    "Korangi",
    "Liaquatabad",
    "Bath Island",
    "Shah Faisal Town",
    "Mehmoodabad",
    "Navy Housing Scheme Karsaz",
    "New Karachi",
    "Bin Qasim Town",
    "Jinnah Avenue",
    "Shahra-e-Faisal",
    "Fazaia Housing Scheme",
    "Civil Lines",
    "Garden West",
    "Abul Hassan Isphani Road",
    "University Road",
    "Shaheed Millat Road",
    "Defence View Society",
    "Khalid Bin Walid Road",
    "Jamshed Road",
    "Frere Town",
    "Saddar Town",
    "Gulberg Town",
    "Sea View Apartments",
    "Orangi Town",
    "Delhi Colony",
    "Gizri"
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
          <p id="predicted-price">Predicted Price is: {Math.round(prediction)} Lakhs</p>
        </div>
      )}
    </div>
  );
}

export default Predict_Karachi;
