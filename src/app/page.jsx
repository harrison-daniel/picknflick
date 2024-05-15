'use client';

import React, { useState, useCallback } from 'react';
import DecisionWheel from './components/DecisionWheel';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import Image from 'next/image';
import PicknFlickLogo from '../../public/images/PicknFlickLogo.png';
import DecisionInput from './components/DecisionInput';

export default function Home() {
  const [options, setOptions] = useState([]);

  const updateOptions = useCallback((newOptions) => {
    setOptions(newOptions);
  }, []);

  return (
    <main className=' mx-auto flex h-screen flex-col items-center  gap-32 '>
      {/* ------------------ Banner ------------------ */}

      <div className='  flex flex-col items-center gap-2 '>
        <div className='flex  px-2 py-2'>
          <Image
            src={PicknFlickLogo}
            height={100}
            alt='Pick n Flick Logo'
            className='logo'
          />
        </div>
        <div className='flex '>
          <h2 className='text-2xl font-extrabold text-zinc-900'>
            Custom Decision Maker
          </h2>
        </div>
      </div>

      {/* ------------------ Wheel + Arrow START ------------------ */}

      <div className=' flex flex-row items-center pl-24 '>
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
                    'option 5',
                    'option 6',
                  ]
            }
          />
        </div>
        <div className='relative -inset-x-3 z-10'>
          <FaLongArrowAltLeft size={100} className=' text-slate-300' />
        </div>
      </div>

      {/* ------------------ Input Popover START ------------------ */}
      <div className=' mt-[3vh] flex justify-center align-middle '>
        <DecisionInput
          require
          options={options}
          updateOptions={updateOptions}
        />
      </div>
    </main>
  );
}
