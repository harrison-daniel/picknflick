// 'use client';
// import React, { useState, useEffect } from 'react';
// import DecisionWheel from './components/DecisionWheel';

// export default function Home() {
//   const [options, setOptions] = useState([]);
//   const [input, setInput] = useState('');

//   const addOption = () => {
//     if (options.length < 6 && input) {
//       setOptions([...options, input]);
//       setInput('');
//     }
//   };

//   const resetOptions = () => {
//     setOptions([]);
//   };

//   useEffect(() => {
//     const handleWheel = (event) => {
//       if (!event.target.classList.contains('roll_inner')) {
//         event.preventDefault();
//       }
//     };

//     window.addEventListener('wheel', handleWheel, { passive: false });

//     return () => {
//       window.removeEventListener('wheel', handleWheel);
//     };
//   }, []);

//   return (
//     <main className='flex min-h-screen flex-col items-center justify-between p-24 '>
//       <div style={{ textAlign: 'center', marginTop: '50px' }}>
//         <div className='pb-12 text-5xl font-bold'>PicknFlick!</div>
//         <p className='italic pb-6'>
//           Add your choices and scroll or swipe to start
//         </p>
//         <input
//           className='text-center border-2 border-gray-600'
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => (e.key === 'Enter' ? addOption() : null)}
//           placeholder='Enter an option'
//           disabled={options.length >= 6} // Disable input when 6 options are reached
//         />
//         <div className='flex justify-center mt-4'>
//           <button
//             onClick={addOption}
//             className='mb-12 p-3 rounded-lg bg-green-600 items-center flex justify-center'
//             disabled={options.length >= 6} // Disable button when 6 options are reached
//             title={
//               options.length >= 6
//                 ? 'Maximum of 6 options reached'
//                 : 'Add Option'
//             } // Tooltip when disabled
//           >
//             Add Option
//           </button>
//           <button
//             onClick={resetOptions}
//             className='mb-12 ml-4 p-3 rounded-lg bg-red-600 items-center flex justify-center'>
//             Reset
//           </button>
//         </div>
//         <DecisionWheel options={options} />
//       </div>
//     </main>
//   );
// }

'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  // Lock scrolling on the main body but allow it on the wheel
  useEffect(() => {
    const handleWheel = (event) => {
      if (!event.target.classList.contains('roll_inner')) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 '>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className='pb-12 text-5xl font-bold'>PicknFlick!</div>
        <p className='italic pb-6'>
          Add your choices and scroll or swipe to start
          <br />
          (6 max)
        </p>
        <input
          className='text-center border-2 border-gray-600'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => (e.key === 'Enter' ? addOption() : null)}
          placeholder='Enter an option'
        />
        <div className='flex justify-center mt-4'>
          {/* <button
            onClick={addOption}
            className='mb-12 p-3 rounded-lg bg-green-600 items-center flex justify-center '>
            Add Option
          </button> */}
          <button
            onClick={addOption}
            className='mb-12 p-3 rounded-lg bg-green-600 items-center flex justify-center'
            disabled={options.length >= 6} // Disable button when 6 options are reached
            title={
              options.length >= 6
                ? 'Maximum of 6 options reached'
                : 'Add Option'
            } // Tooltip when disabled
          >
            Add Option
          </button>
          <button
            onClick={resetOptions}
            className='mb-12 ml-4 p-3 rounded-lg bg-red-600 items-center flex justify-center'>
            Reset
          </button>
        </div>
        <div className='flex'>
          <DecisionWheel options={options} />
          <div className='flex items-center  '>
            <FaLongArrowAltLeft size={100} />
          </div>
        </div>
      </div>
    </main>
  );
}
