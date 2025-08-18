import React, { useState, useEffect } from 'react';

const Alert = ({ type, message, duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const classes = {
    success: 'bg-green-100 border-green-500 text-green-700',
    error: 'bg-red-100 border-red-500 text-red-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  };

  return (
    <div className={`alert ${classes[type]} p-4 rounded mb-4 ${visible ? '' : 'hidden'}`}>
      <span className="font-bold">{type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Success'}</span>
      <span className="ml-2">{message}</span>
    </div>
  );
};

export default Alert;