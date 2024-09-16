import React, { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

const Alerts = ({ showAlert, setShowAlert, message, variant }) => {
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert, setShowAlert]);

  return (
    showAlert && (
      <div style={{ textAlign: 'center', maxHeight: '10px' }}>
        <Alert variant={variant} onClose={() => setShowAlert(false)} dismissible>
          {message}
        </Alert>
      </div>
    )
  );
};

export default Alerts;
