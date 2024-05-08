'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const colors = [
  'rgba(42, 82, 190, 1.0)', // Cerulean Blue
  'rgba(215, 0, 64, 1.0)', // Carmine Red
  'rgba(255, 191, 0, 1.0)', // Amber
  'rgba(0, 158, 115, 1.0)', // Emerald Green
  'rgba(143, 0, 255, 1.0)', // Violet
  'rgba(255, 88, 0, 1.0)', // Tangerine
];

// const colors = ['rgba(0, 0, 0, 1.0)'];

// 1 is for no transparency

const DecisionWheel = ({ options }) => {
  const wheelRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndVelocity = useRef(0);
  const [rotation, setRotation] = useState(0);

  // Determine the number of slots and their physical characteristics
  const totalSlots = useMemo(() => {
    if (options.length === 2) return 4;
    return options.length;
  }, [options.length]);

  const degreePerSlot = 360 / totalSlots;
  // OG SIZE
  // const paneSize = 275;
  const paneSize = 135;
  const zDepth = paneSize / (2 * Math.tan(Math.PI / totalSlots));

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const scrollIntensity = Math.abs(event.deltaY);
      const scrollDirection = event.deltaY > 0 ? -1 : 1;
      const spinMagnitude =
        scrollDirection * scrollIntensity * degreePerSlot * 0.01; // Tuned spin magnitude for desktop
      spinWheel(spinMagnitude);
    };

    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0].clientY;
      wheelRef.current.style.transform = 'scale(1.03)'; // Visual feedback on touch
      if (navigator.vibrate) {
        // Haptic feedback on touch
        navigator.vibrate(50);
      }
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;
      touchEndVelocity.current = deltaY;
    };

    const handleTouchEnd = () => {
      wheelRef.current.style.transform = 'scale(1)'; // Reset visual scale
      if (Math.abs(touchEndVelocity.current) > 10) {
        const direction = touchEndVelocity.current > 0 ? -1 : 1;
        const swipeIntensity = Math.abs(touchEndVelocity.current);
        const spinMagnitude = direction * swipeIntensity * degreePerSlot * 0.06; //  spin magnitude for mobile
        spinWheel(spinMagnitude);
      }
      touchEndVelocity.current = 0;
    };

    //   window.addEventListener('wheel', handleWheel, { passive: false });
    //   wheelRef.current.addEventListener('touchstart', handleTouchStart, {
    //     passive: false,
    //   });
    //   wheelRef.current.addEventListener('touchmove', handleTouchMove, {
    //     passive: false,
    //   });
    //   wheelRef.current.addEventListener('touchend', handleTouchEnd, {
    //     passive: false,
    //   });

    //   return () => {
    //     window.removeEventListener('wheel', handleWheel);
    //     wheelRef.current.removeEventListener('touchstart', handleTouchStart);
    //     wheelRef.current.removeEventListener('touchmove', handleTouchMove);
    //     wheelRef.current.removeEventListener('touchend', handleTouchEnd);
    //   };
    // }, [degreePerSlot, rotation]);

    // Check if wheelRef.current is not null before adding event listeners
    if (wheelRef.current) {
      wheelRef.current.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      wheelRef.current.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      wheelRef.current.addEventListener('touchend', handleTouchEnd, {
        passive: false,
      });
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Cleanup function
    return () => {
      if (wheelRef.current) {
        wheelRef.current.removeEventListener('touchstart', handleTouchStart);
        wheelRef.current.removeEventListener('touchmove', handleTouchMove);
        wheelRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('wheel', handleWheel);
    };
  }, [degreePerSlot, options.length, rotation]); // Make sure all dependencies are included if they affect the listeners

  const spinWheel = (spinMagnitude) => {
    const randomComponent = Math.random() * 360 - 180;
    requestAnimationFrame(() => {
      const finalRotation = rotation + spinMagnitude + randomComponent;
      setRotation(finalRotation);
    });
  };

  return (
    <div className='roll' ref={wheelRef} style={{ perspective: '1000px' }}>
      <motion.div
        className='roll_inner'
        style={{ transform: `rotateX(${rotation}deg)` }}
        transition={{ duration: 3.5, ease: 'easeOut' }}>
        {totalSlots === 4 && options.length === 2
          ? [...Array(totalSlots)].map((_, index) => (
              <>
                <motion.div
                  key={index}
                  className='roll_inner__button'
                  style={{
                    transform: `rotateX(${
                      index * -degreePerSlot
                    }deg) translateZ(${zDepth}px)`,
                    transformStyle: 'preserve-3d',
                    height: `${paneSize}px`,
                    lineHeight: `${paneSize}px`,
                    width: '100%',
                    background: colors[index % 2], // Apply colors in pairs
                    // position: 'absolute',
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  {options[index % 2]}
                </motion.div>
              </>
            ))
          : options.map((option, index) => (
              <>
                <motion.div
                  key={index}
                  className='roll_inner__button'
                  style={{
                    transform: `rotateX(${
                      index * -degreePerSlot
                    }deg) translateZ(${zDepth}px)`,
                    transformStyle: 'preserve-3d',
                    height: `${paneSize}px`,
                    lineHeight: `${paneSize}px`,
                    width: '100%',
                    background: colors[index % colors.length],
                    // position: 'absolute',
                    textAlign: 'center',
                    color: 'white',
                  }}>
                  {option}
                </motion.div>
              </>
            ))}
      </motion.div>
    </div>
  );
};

export default DecisionWheel;
