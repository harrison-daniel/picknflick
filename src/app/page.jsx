'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent } from './components/ui/dialog';
import DecisionWheel from './components/DecisionWheel';
import { AiFillCaretLeft } from 'react-icons/ai';
import { GiPointing } from 'react-icons/gi';
import { IoInformationCircle } from 'react-icons/io5';
import DecisionInput from './components/DecisionInput';
import WelcomeDialog from './components/WelcomeDialog';

export default function Home() {
  const [options, setOptions] = useState([]);
  const [winner, setWinner] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);
  const lastSpinTimeRef = useRef(0);
  const spinTimeoutRef = useRef(null);

  const updateOptions = useCallback((newOptions) => {
    setOptions(newOptions);
  }, []);

  const handleSpinComplete = (selectedOption) => {
    lastSpinTimeRef.current = Date.now();

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }

    const timeoutDuration = 1450;

    spinTimeoutRef.current = setTimeout(() => {
      const timeSinceLastSpin = Date.now() - lastSpinTimeRef.current;
      if (timeSinceLastSpin >= timeoutDuration) {
        setWinner(selectedOption);
        setDialogOpen(true);
      }
    }, timeoutDuration);
  };

  const handleSpinStart = () => {
    setDialogOpen(false);

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
  };

  const handleInfoClick = () => {
    setIsWelcomeDialogOpen(true);
  };

  return (
    <main className='mx-auto flex h-screen select-none flex-col items-center'>
      <WelcomeDialog
        isOpen={isWelcomeDialogOpen}
        setIsOpen={setIsWelcomeDialogOpen}
      />

      {/* Banner */}
      <div className='flex flex-col items-center justify-center'>
        <div className='flex flex-row items-center justify-around gap-6 pt-12 text-center'>
          <div className='mx-auto flex w-full justify-center '>
            <h1 className='font-sans text-5xl font-bold md:text-6xl '>
              Pick n Flick
            </h1>
          </div>
          <div className='flex text-[3rem]'>
            <GiPointing />
          </div>
        </div>
      </div>

      {/* Wheel + Arrow */}
      <div className='mt-[17vh] flex flex-row items-center pl-28'>
        <div>
          <DecisionWheel
            options={
              options.length
                ? options
                : [
                    'Option 1',
                    'Option 2',
                    'Option 3',
                    'Option 4',
                    'Option 5',
                    'Option 6',
                  ]
            }
            onSpinComplete={handleSpinComplete}
            onSpinStart={handleSpinStart}
          />
        </div>
        <div className='relative -inset-x-11'>
          <AiFillCaretLeft size={120} className='text-red-700' />
        </div>
      </div>

      {/* Input and Info Popover */}
      <div className='mt-[25vh] flex flex-row justify-center gap-6 align-middle md:mt-[19vh]'>
        <DecisionInput options={options} updateOptions={updateOptions} />
        <div className='flex items-center align-middle'>
          <IoInformationCircle
            size={30}
            className='cursor-pointer font-bold   text-neutral-800 hover:text-neutral-500 active:text-neutral-500'
            onClick={handleInfoClick}
          />
        </div>
      </div>

      {/* Winner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='w-[18rem] rounded-lg '>
          <div className='text-center'>
            {winner ? (
              <p className='text-2xl font-semibold'>
                <span className='text-red-700'>{winner}</span> wins!
              </p>
            ) : (
              <p>Spinning...</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
