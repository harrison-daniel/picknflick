'use client';

import React, { useState, useCallback } from 'react';
import DecisionWheel from './components/DecisionWheel';
import Image from 'next/image';
import PicknFlickLogo3 from '../../public/images/PicknFlick-logo-3.png';
import PicknFlickHeader from '../../public/images/PicknFlick-header.png';
import { AiFillCaretLeft } from 'react-icons/ai';

import DecisionInput from './components/DecisionInput';

export default function Home() {
  const [options, setOptions] = useState([]);

  const updateOptions = useCallback((newOptions) => {
    setOptions(newOptions);
  }, []);

  return (
    <main className=' mx-auto flex h-screen flex-col items-center   '>
      {/* ------------------ Banner ------------------ */}

      <div className=' flex flex-col items-center justify-center '>
        <div className=''>
          <Image
            src={PicknFlickLogo3}
            // height={190}
            alt='Pick n Flick Logo'
            className='w-40 lg:w-72'
          />
        </div>
        <div>
          <Image
            src={PicknFlickHeader}
            // height={40}
            alt='Pick n Flick Logo'
            className='w-60 md:w-96'
          />
        </div>
      </div>

      {/* ------------------ Wheel + Arrow START ------------------ */}

      <div className=' mt-[17vh] flex flex-row items-center pl-28 '>
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
        <div className='relative -inset-x-11 '>
          <AiFillCaretLeft size={120} className=' text-orange-700' />
        </div>
      </div>

      {/* ------------------ Input Popover START ------------------ */}
      <div className=' mt-[19vh] flex justify-center align-middle '>
        <DecisionInput
          require
          options={options}
          updateOptions={updateOptions}
        />
      </div>
    </main>
  );
}
