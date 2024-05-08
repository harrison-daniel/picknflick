import React, { useState } from 'react';

const options = [
  'Option 1',
  'Option 2',
  'Option 3', // Add more options as needed
];

export default function Wheel() {
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState('');

  const addOption = () => {
    if (input) {
      setOptions((prev) => [...prev, input]);
      setInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addOption();
    }
  };

  return (
    <div className='app-container'>
      <div className='input-container'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Enter an option'
          className='input-field'
        />
        <button onClick={addOption} className='add-btn'>
          Add Option
        </button>
      </div>
      {options.length > 0 && (
        <div className='wheel-container'>
          <div className='wheel'>
            {options.map((option, index) => (
              <div
                key={index}
                className='face'
                style={{
                  transform: `rotateX(${
                    (360 / options.length) * index
                  }deg) translateZ(150px)`,
                }}>
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
