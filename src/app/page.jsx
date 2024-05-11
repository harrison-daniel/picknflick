'use client';

import React, { useState } from 'react';
import DecisionWheel from './components/DecisionWheel';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { FaRegSquarePlus } from 'react-icons/fa6';
import Image from 'next/image';
import PicknFlickLogo from '../../public/images/PicknFlickLogo.png';

export default function Home() {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState('');

  const addOption = () => {
    if (options.length < 6 && input) {
      // Sanitize input to remove HTML tags
      const sanitizedInput = input.replace(/<\/?[^>]+(>|$)/g, '');
      setOptions([...options, sanitizedInput]);
      setInput('');
    }
  };

  const resetOptions = () => {
    setOptions([]);
  };

  const placeholderOptions = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'option 5',
    'option 6',
  ];

  return (
    <main className='h-screen'>
      {/* ------------------ Banner ------------------ */}
      <div className='text-center mt-[2vh] px-4 mx-auto flex flex-col justify-center'>
        <div className='flex justify-center '>
          <Image
            src={PicknFlickLogo}
            height={150}
            alt='Pick n Flick Logo'
            className='logo  '
          />
        </div>

        <h2 className='mt-1 font-bold text-sm italic text-slate-200 md:text-lg'>
          Custom Decision Maker
        </h2>
      </div>

      {/* ------------------ Wheel + Arrow ------------------ */}
      <div className='flex-row flex justify-center items-center  align-middle mt-14 pl-24 h-72'>
        {options.length > 0 ? (
          <DecisionWheel options={options} />
        ) : (
          <DecisionWheel options={placeholderOptions} />
        )}
        <FaLongArrowAltLeft
          size={100}
          className='z-10 relative -inset-x-7  text-slate-300'
        />
      </div>

      {/* ------------------ INPUT  ------------------ */}

      {/* <div className='flex flex-col mt-9 '> */}
      <div className='flex flex-col mt-[6vh] '>
        <div className='h-20 flex justify-end  mx-auto flex-col'>
          {options.length === 1 && (
            <p className='h-7 text-red-500'>Add one more option to start!</p>
          )}
          {options.length >= 6 && (
            <p className='h-7 text-red-500'>Maximum of 6 options reached!</p>
          )}
          <input
            type='text'
            className='rounded-md h-11 w-full text-center border-2 text-black bg-slate-200 border-gray-600'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // onKeyPress={(e) =>
            //   e.key === 'Enter' && options.length < 6 && addOption()
            // }
            onKeyDown={(e) =>
              e.key === 'Enter' && options.length < 6 && addOption()
            }
            maxLength={14}
            placeholder='Enter your options here!'
            disabled={options.length >= 6}
          />
        </div>
        <div className='flex justify-center mt-4 gap-4'>
          <button
            onClick={addOption}
            className='font-semibold px-3 py-2 rounded-md bg-slate-300 items-center flex flex-row gap-2'>
            Add Option
            <FaRegSquarePlus className='flex align-middle' size={18} />
          </button>
          <button
            onClick={resetOptions}
            className='text-slate-100 font-semibold px-3 py-2 rounded-md bg-red-900'>
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
