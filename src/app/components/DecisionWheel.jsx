'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const colors = [
  'color(display-p3 0.100 0.100 0.100)',
  'color(display-p3 0.150 0.150 0.150)',
  'color(display-p3 0.200 0.200 0.200)',
  'color(display-p3 0.250 0.250 0.250)',
  'color(display-p3 0.300 0.300 0.300)',
  'color(display-p3 0.350 0.350 0.350)',
];

const DecisionWheel = ({ options, onSpinComplete, onSpinStart }) => {
  const wheelRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndVelocity = useRef(0);
  const [rotation, setRotation] = useState(0);

  const totalSlots = useMemo(() => {
    if (options.length === 2) return 4;
    return options.length;
  }, [options.length]);

  const degreePerSlot = 360 / totalSlots;
  const paneSize = 165;
  const zDepth = paneSize / (2 * Math.tan(Math.PI / totalSlots));

  const spinWheel = (spinMagnitude) => {
    if (onSpinStart) {
      onSpinStart();
    }

    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomComponent = (array[0] / (0xffffffff + 1)) * 360 - 180;
    const finalRotation = rotation + spinMagnitude + randomComponent;

    const offset = degreePerSlot * 0.1 * (Math.random() - 0.5);
    const adjustedRotation = finalRotation + offset;

    setRotation(adjustedRotation);

    setTimeout(() => {
      const normalizedRotation = ((adjustedRotation % 360) + 360) % 360;
      const selectedIndex =
        Math.floor((normalizedRotation + degreePerSlot / 2) / degreePerSlot) %
        totalSlots;
      const selectedOption = options[selectedIndex];
      if (onSpinComplete) {
        onSpinComplete(selectedOption);
      }
    }, 4500);
  };

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      const scrollIntensity = Math.abs(event.deltaY);
      const scrollDirection = event.deltaY > 0 ? -1 : 1;
      const spinMagnitude =
        scrollDirection * scrollIntensity * degreePerSlot * 0.025;
      spinWheel(spinMagnitude);
    };

    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0].clientY;
      wheelRef.current.style.transform = 'scale(1.03)';
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    };

    const handleTouchMove = (event) => {
      const currentY = event.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;
      touchEndVelocity.current = deltaY;
    };

    const handleTouchEnd = () => {
      wheelRef.current.style.transform = 'scale(1)';
      if (Math.abs(touchEndVelocity.current) > 10) {
        const direction = touchEndVelocity.current > 0 ? -1 : 1;
        const swipeIntensity = Math.abs(touchEndVelocity.current);
        const spinMagnitude =
          direction * swipeIntensity * degreePerSlot * 0.16 +
          Math.random() * degreePerSlot * 5;
        spinWheel(spinMagnitude);
      }
      touchEndVelocity.current = 0;
    };

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

    return () => {
      if (wheelRef.current) {
        wheelRef.current.removeEventListener('touchstart', handleTouchStart);
        wheelRef.current.removeEventListener('touchmove', handleTouchMove);
        wheelRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('wheel', handleWheel);
    };
  }, [degreePerSlot, options.length, rotation]);

  return (
    <div
      className='roll'
      ref={wheelRef}
      style={{ perspective: '1000px', userSelect: 'none' }}>
      <motion.div
        className='roll_inner'
        style={{ transform: `rotateX(${rotation}deg)` }}
        transition={{ duration: 4.5, ease: 'easeOut' }}>
        {totalSlots === 4 && options.length === 2
          ? [...Array(totalSlots)].map((_, index) => (
              <motion.div
                key={index}
                className='roll_inner__button'
                style={{
                  transform: `rotateX(${index * -degreePerSlot}deg) translateZ(${zDepth}px)`,
                  transformStyle: 'preserve-3d',
                  height: `${paneSize}px`,
                  lineHeight: `${paneSize}px`,
                  width: '100%',
                  background: colors[index % 2],
                  textAlign: 'center',
                  color: 'white',
                }}>
                {options[index % 2]}
              </motion.div>
            ))
          : options.map((option, index) => (
              <motion.div
                key={index}
                className='roll_inner__button'
                style={{
                  transform: `rotateX(${index * -degreePerSlot}deg) translateZ(${zDepth}px)`,
                  transformStyle: 'preserve-3d',
                  height: `${paneSize}px`,
                  lineHeight: `${paneSize}px`,
                  width: '100%',
                  background: colors[index % colors.length],
                  textAlign: 'center',
                  color: 'white',
                }}>
                {option}
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
};

export default DecisionWheel;
