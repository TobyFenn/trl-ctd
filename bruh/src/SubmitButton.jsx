import React from 'react';

const SubmitButton = () => {
  return (
    <div className="flight-input submit-button">
      <button
        type="submit"
        style={{
          fontSize: '18px',
          height: '40px',
          width: '200px',
          borderRadius: '10px',
          background: '#282c34', // Dark background color
          color: 'white', // Light text color
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
