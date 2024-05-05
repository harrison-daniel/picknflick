// --------------------------------------------

// BEST WORKING VERISON WITH TOUCH AND SCROLL
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DecisionWheel = ({ options }) => {
  const [rotation, setRotation] = useState(0);
  const lastTouchY = useRef(0);
  const touchVelocity = useRef(0);
  const degreePerOption = 360 / options.length;

  useEffect(() => {
    const handleWheel = (event) => {
      const delta = event.deltaY > 0 ? degreePerOption : -degreePerOption;
      setRotation((prev) => prev + delta);
    };

    const handleTouchStart = (event) => {
      lastTouchY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      touchVelocity.current = deltaY;
      lastTouchY.current = currentY;
    };

    const handleTouchEnd = () => {
      const spinMagnitude = touchVelocity.current * 80; // Adjust multiplier for desired sensitivity
      const finalRotation =
        rotation + spinMagnitude + (Math.random() * 360 - 180); // Randomize stopping point
      setRotation(finalRotation);
      touchVelocity.current = 0; // Reset velocity
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [degreePerOption, rotation]);

  return (
    <div className='roll'>
      <div className='roll_outer '></div>
      <motion.div
        className='roll_inner '
        style={{ transform: `rotateX(${rotation}deg)` }}>
        {options.map((option, index) => (
          <motion.div
            key={index}
            className='roll_inner__button '
            style={{
              transform: `rotateX(${
                index * -degreePerOption
              }deg) translateZ(100px)`,
              transformStyle: 'preserve-3d',
            }}>
            {option}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DecisionWheel;
