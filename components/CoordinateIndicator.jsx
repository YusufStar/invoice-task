import React, { useState, useEffect } from 'react';

const CoordinateIndicator = ({ onClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        width: '32px',
        height: '12px',
        border: '2px solid #000',
        boxSizing: 'border-box',
        transform: 'translate(-12px, -12px)',
        pointerEvents: 'none', // Prevents the indicator from blocking mouse events on the canvas
        left: position.x,
        top: position.y,
      }}
      onClick={() => onClick(position)}
    />
  );
};

export default CoordinateIndicator;