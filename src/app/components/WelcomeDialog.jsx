'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export default function WelcomeDialog({ isOpen, setIsOpen }) {
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
          <p>1. Use the "Open Options" button to add your choices.</p>
          <p className='pt-3'>
            2. Flick your mouse wheel or touchpad to start the spin!
          </p>
          <p className='pt-3'>
            3. The winner will be displayed once the wheel has stopped.
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
