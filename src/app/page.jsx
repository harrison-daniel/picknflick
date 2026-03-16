'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import WinnerDialog from './components/WinnerDialog';
import DecisionWheel from './components/DecisionWheel';
import { AiFillCaretLeft } from 'react-icons/ai';
import { GiPointing } from 'react-icons/gi';
import { IoInformationCircle } from 'react-icons/io5';
import { MdHistory } from 'react-icons/md';
import DecisionInput from './components/DecisionInput';
import WelcomeDialog from './components/WelcomeDialog';
import HistoryDialog from './components/HistoryDialog';
import { useWebHaptics } from 'web-haptics/react';
import { playDing } from './lib/wheelAudio';

export default function Home() {
  const [options, setOptions] = useState([]);
  const [winner, setWinner] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const lastSpinTimeRef = useRef(0);
  const spinTimeoutRef = useRef(null);
  const { trigger: haptic } = useWebHaptics();

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('spinHistory');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch {
      localStorage.removeItem('spinHistory');
    }
  }, []);

  const addToHistory = useCallback((option) => {
    setHistory((prev) => {
      const updated = [{ option, timestamp: Date.now() }, ...prev].slice(0, 50);
      localStorage.setItem('spinHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('spinHistory');
    haptic('nudge');
  }, [haptic]);

  const handleSpinComplete = useCallback(
    (selectedOption) => {
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
          addToHistory(selectedOption);
          haptic('success');
          playDing();
        }
      }, timeoutDuration);
    },
    [addToHistory, haptic],
  );

  const handleSpinStart = useCallback(() => {
    setDialogOpen(false);

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
  }, []);

  const anyModalOpen = dialogOpen || isHistoryOpen || isInfoOpen;

  return (
    <main className='fixed inset-0 flex select-none flex-col items-center overflow-hidden'>
      <div className='flex h-full w-full max-w-lg flex-col items-center justify-evenly px-6 py-8'>
        <div className='flex items-center gap-6 pb-4'>
          <h1 className='font-sans text-5xl font-bold md:text-6xl'>
            Pick n Flick
          </h1>
          <GiPointing className='text-[3rem]' />
        </div>

        <div className='relative'>
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
            disabled={anyModalOpen}
          />
          <AiFillCaretLeft
            size={120}
            className='absolute top-1/2 -translate-y-1/2 text-red-700'
            style={{ left: 'calc(100% - 44px)' }}
          />
        </div>

        <div className='flex items-center justify-center gap-6 pt-4'>
          <DecisionInput options={options} updateOptions={setOptions} />
          <div className='flex items-center gap-3'>
            <MdHistory
              size={28}
              className='cursor-pointer text-neutral-800 hover:text-neutral-500 active:text-neutral-500'
              onClick={() => setIsHistoryOpen(true)}
            />
            <IoInformationCircle
              size={30}
              className='cursor-pointer font-bold text-neutral-800 hover:text-neutral-500 active:text-neutral-500'
              onClick={() => setIsInfoOpen(true)}
            />
          </div>
        </div>
      </div>

      <WelcomeDialog />
      <HistoryDialog
        isOpen={isHistoryOpen}
        setIsOpen={setIsHistoryOpen}
        history={history}
        onClear={clearHistory}
      />
      <WinnerDialog
        open={dialogOpen}
        winner={winner}
        onClose={() => {
          setDialogOpen(false);
          if (spinTimeoutRef.current) {
            clearTimeout(spinTimeoutRef.current);
            spinTimeoutRef.current = null;
          }
        }}
      />
      {isInfoOpen && (
        <WelcomeDialog onDismiss={() => setIsInfoOpen(false)} />
      )}
    </main>
  );
}
