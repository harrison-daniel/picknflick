'use client';

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useWebHaptics } from 'web-haptics/react';
import {
  initAudio,
  scheduleTickSounds,
  clearTickSchedule,
} from '../lib/wheelAudio';

const colors = [
  'color(display-p3 0.100 0.100 0.100)',
  'color(display-p3 0.150 0.150 0.150)',
  'color(display-p3 0.200 0.200 0.200)',
  'color(display-p3 0.250 0.250 0.250)',
  'color(display-p3 0.300 0.300 0.300)',
  'color(display-p3 0.350 0.350 0.350)',
];

const MIN_ROTATIONS = 3;
const SPIN_DURATION_MIN = 3000;
const SPIN_DURATION_MAX = 8000;
const BEZIER = 'cubic-bezier(0.12, 0.8, 0.2, 1)';

const DecisionWheel = ({ options, onSpinComplete, onSpinStart, disabled }) => {
  const wheelRef = useRef(null);
  const lastTouchY = useRef(0);
  const lastTouchTime = useRef(0);
  const touchVelocity = useRef(0);
  const spinTimeoutRef = useRef(null);
  const tickTimeoutsRef = useRef([]);
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);
  const [spinDuration, setSpinDuration] = useState(5500);

  const { trigger: haptic } = useWebHaptics();

  const totalSlots = useMemo(() => {
    return options.length === 2 ? 4 : options.length;
  }, [options.length]);

  const degreePerSlot = 360 / totalSlots;
  const paneSize = 165;
  const zDepth = paneSize / (2 * Math.tan(Math.PI / totalSlots));

  const spinWheel = useCallback(
    (spinMagnitude) => {
      if (disabled) return;

      initAudio();
      onSpinStart?.();

      const direction = spinMagnitude >= 0 ? 1 : -1;
      const absMagnitude = Math.abs(spinMagnitude);

      const minDegrees = MIN_ROTATIONS * 360;
      const velocityDegrees = minDegrees + absMagnitude * 2;

      const array = new Uint32Array(2);
      window.crypto.getRandomValues(array);
      const extraRotations = 1 + (array[0] / (0xffffffff + 1)) * 2;
      const baseSpin = velocityDegrees + extraRotations * 360;

      const randomLanding = (array[1] / (0xffffffff + 1)) * 360;

      const fullRotations = Math.floor(baseSpin / 360) * 360;
      const adjustedRotation =
        rotationRef.current + direction * (fullRotations + randomLanding);

      const rotationDelta = Math.abs(adjustedRotation - rotationRef.current);
      const duration = Math.round(
        Math.min(
          SPIN_DURATION_MAX,
          Math.max(SPIN_DURATION_MIN, 1500 + rotationDelta * 0.7),
        ),
      );

      rotationRef.current = adjustedRotation;
      setSpinDuration(duration);
      setRotation(adjustedRotation);

      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
      clearTickSchedule(tickTimeoutsRef.current);

      const currentNorm =
        ((Math.abs(rotationRef.current) % degreePerSlot) + degreePerSlot) %
        degreePerSlot;
      const offsetToFirst =
        currentNorm < 0.01 ? degreePerSlot : degreePerSlot - currentNorm;

      tickTimeoutsRef.current = scheduleTickSounds(
        rotationDelta,
        degreePerSlot,
        duration,
        offsetToFirst,
      );

      spinTimeoutRef.current = setTimeout(() => {
        const normalizedRotation = ((adjustedRotation % 360) + 360) % 360;
        const selectedIndex =
          Math.floor(
            (normalizedRotation + degreePerSlot / 2) / degreePerSlot,
          ) % totalSlots;
        const selectedOption = options[selectedIndex % options.length];

        haptic('success');
        onSpinComplete?.(selectedOption);
      }, duration);
    },
    [
      degreePerSlot,
      options,
      totalSlots,
      onSpinComplete,
      onSpinStart,
      disabled,
      haptic,
    ],
  );

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      clearTickSchedule(tickTimeoutsRef.current);
    };
  }, []);

  const handleTouchStart = useCallback(
    (event) => {
      initAudio();
      const y = event.touches[0].clientY;
      lastTouchY.current = y;
      lastTouchTime.current = performance.now();
      touchVelocity.current = 0;

      if (wheelRef.current) {
        wheelRef.current.style.transform = 'scale(1.03)';
      }
      haptic('nudge');
    },
    [haptic],
  );

  const handleTouchMove = useCallback((event) => {
    const currentY = event.touches[0].clientY;
    const now = performance.now();
    const dt = now - lastTouchTime.current;

    if (dt > 5) {
      const instantVelocity = (currentY - lastTouchY.current) / dt;
      touchVelocity.current =
        touchVelocity.current * 0.2 + instantVelocity * 0.8;
      lastTouchY.current = currentY;
      lastTouchTime.current = now;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = 'scale(1)';
    }

    const velocity = touchVelocity.current;
    const absVelocity = Math.abs(velocity);

    if (absVelocity > 0.12) {
      const direction = velocity > 0 ? -1 : 1;
      const spinMagnitude = direction * absVelocity * 500;
      spinWheel(spinMagnitude);
    }

    touchVelocity.current = 0;
  }, [spinWheel]);

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      initAudio();
      if (disabled) return;

      const scrollIntensity = Math.abs(event.deltaY);
      const scrollDirection = event.deltaY > 0 ? -1 : 1;
      const spinMagnitude =
        scrollDirection * scrollIntensity * 1.2;
      spinWheel(spinMagnitude);
    },
    [spinWheel, disabled],
  );

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel]);

  return (
    <div
      className='roll'
      ref={wheelRef}
>
      <div
        className='roll_inner'
        style={{
          transform: `rotateX(${rotation}deg)`,
          transition: `transform ${spinDuration}ms ${BEZIER}`,
        }}>
        {[...Array(totalSlots)].map((_, index) => (
          <div
            key={index}
            className='roll_inner__button'
            style={{
              transform: `rotateX(${index * -degreePerSlot}deg) translateZ(${zDepth}px)`,
              height: `${paneSize}px`,
              lineHeight: `${paneSize}px`,
              width: '100%',
              background:
                options.length === 2
                  ? colors[index % 2]
                  : colors[index % colors.length],
              textAlign: 'center',
              color: 'white',
            }}>
            {options[index % options.length]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionWheel;
