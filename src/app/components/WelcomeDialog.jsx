'use client';

import { useState } from 'react';
import useMediaQuery from '../lib/useMediaQuery';
import { useWebHaptics } from 'web-haptics/react';
import { initAudio } from '../lib/wheelAudio';

export default function WelcomeDialog({ onDismiss }) {
  const [visible, setVisible] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { trigger: haptic } = useWebHaptics();

  const handleDismiss = () => {
    initAudio();
    haptic('nudge');
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      onClick={handleDismiss}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleDismiss();
      }}>
      <div className='absolute inset-0 bg-black/80' />
      <div className='relative z-10 w-[20rem] rounded-lg border bg-white p-8 shadow-lg'>
        <h2 className='text-center text-lg font-semibold'>
          Welcome to Pick n Flick!
        </h2>
        <div className='mt-4 text-gray-700'>
          <p>1. Add your choices with the &quot;Open Options&quot; button.</p>
          <p className='pt-3'>
            {isDesktop
              ? '2. Flick your mouse wheel or touchpad to start the spin.'
              : '2. Tap and hold the wheel, then flick to start the spin.'}
          </p>
        </div>
        <p className='mt-6 text-center text-sm text-gray-400'>
          Tap anywhere to start
        </p>
      </div>
    </div>
  );
}
