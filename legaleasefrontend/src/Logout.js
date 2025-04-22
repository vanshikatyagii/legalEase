import React, { useEffect, useState } from 'react';
import './Logout.css';

const Logout = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300); // delay for animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="logout-wrapper">
      <div className={`thankyou-message ${visible ? 'visible' : ''}`}>
        Thank you for using <span className="brand">LegalEase</span>!
      </div>
    </div>
  );
};

export default Logout;
