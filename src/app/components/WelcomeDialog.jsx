'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import useMediaQuery from '../lib/useMediaQuery';

export default function WelcomeDialog({ isOpen, setIsOpen }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>
            Welcome to Pick n Flick!
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 text-gray-700'>
          <p>1. Add your choices with the &quot;Open Options&quot; button.</p>
          <p className='pt-3'>
            <span className='hidden md:inline'>
              2. Flick your mouse wheel or touchpad to start the spin.
            </span>
            <span className='inline md:hidden'>
              2. Tap and hold the wheel, then flick to start the spin.
            </span>
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className='mt-6 rounded-lg bg-slate-950 px-4 py-2 text-white'>
          Got it!
        </button>
      </DialogContent>
    </Dialog>
  );
}
