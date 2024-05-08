'use client';

import React, { useState, useEffect } from 'react';
import DecisionWheel from './components/DecisionWheel';
import { FaLongArrowAltLeft } from 'react-icons/fa';

export default function Home() {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState('');

  const addOption = () => {
    if (options.length < 6 && input) {
      setOptions([...options, input]);
      setInput('');
    }
  };

  const resetOptions = () => {
    setOptions([]);
  };

  return (
    <main className='h-screen'>
      <div className='text-center mt-8 p-4 flex flex-col justify-center'>
        <h1 className='mb-3 text-6xl font-bold'>PicknFlick</h1>
        <h2 className='text-lg mb-3'>
          Custom Decision Maker <span className='italic'>with a twist!</span>
        </h2>

        <div className='flex flex-col justify-center mx-auto h-16'>
          {options.length === 1 && (
            <p className='text-red-500'>Add one more option to start! </p>
          )}
          {options.length >= 6 && (
            <p className='text-red-500'>Maximum of 6 options reached!</p>
          )}
          <input
            className='flex justify-center  w-full text-center border-2 border-gray-600'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && options.length < 6 ? addOption() : null
            }
            placeholder='Enter your options here!'
            disabled={options.length >= 6}
          />
        </div>
        <div className='flex justify-center mt-2 gap-4'>
          <button
            onClick={addOption}
            className=' px-4 py-2.5 rounded-lg bg-green-600 items-center  '>
            Add Option
          </button>
          <button
            onClick={resetOptions}
            className=' px-3 py-2.5 rounded-lg bg-red-600 '>
            Reset
          </button>
        </div>
      </div>

      {options.length > 1 && (
        <>
          <div className='flex justify-center font-bold mt-3'>
            Just Flick It!
          </div>
          <div className='flex-row flex justify-center items-center align-middle mt-24 pl-16'>
            <DecisionWheel options={options} className='' />
            <div className='flex z-10'>
              <FaLongArrowAltLeft size={100} className='' />
            </div>
          </div>
        </>
      )}
    </main>
  );
}
