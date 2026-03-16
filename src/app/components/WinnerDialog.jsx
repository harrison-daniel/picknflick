'use client';

import { useEffect, useCallback } from 'react';

export default function WinnerDialog({ open, winner, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open || !winner) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      onClick={onClose}
      onTouchEnd={(e) => {
        e.preventDefault();
        onClose();
      }}>
      <div className='absolute inset-0 bg-black/80' />
      <div className='relative z-10 w-[20rem] rounded-lg border bg-white p-8 shadow-lg'>
        <p className='text-center text-2xl font-semibold'>
          <span className='text-red-700'>{winner}</span> wins!
        </p>
        <p className='mt-3 text-center text-sm text-gray-400'>
          Tap anywhere to close
        </p>
      </div>
    </div>
  );
}
