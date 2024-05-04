import React from 'react';
import './style/cities.css';
import { useNavigate } from 'react-router-dom';

function Cities() {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleButtonClick = (destination) => {
    return () => {
      navigate(destination); // Navigate to the specified page
    };
  };

  return (
    <div className="Cities">
      <h1>Select City</h1>
      <button className="Lahore" onClick={handleButtonClick('/predict_lahore')}>Lahore</button> {/* Corrected event handler */}
      <button className="Lahore" onClick={handleButtonClick('/predict_karachi')}>Karachi</button> {/* Corrected event handler */}
    </div>
  );
}

export default Cities;
