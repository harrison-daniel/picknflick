// #1

'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegWindowClose, FaPlus } from 'react-icons/fa';

function DecisionInput({ options, updateOptions }) {
  const [tempOptions, setTempOptions] = useState(() =>
    options.length >= 2 ? options.map((opt) => sanitizeInput(opt)) : ['', ''],
  );

  const sanitizeInput = (input) => {
    return input.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const validateOptions = (optionsArray) => {
    return optionsArray.filter((option) => option.trim() !== '').length >= 2;
  };

  const handleOptionChange = (event, index) => {
    const sanitizedValue = sanitizeInput(event.target.value);
    const newOptions = [...tempOptions];
    newOptions[index] = sanitizedValue;
    setTempOptions(newOptions);
  };

  const handleBlur = () => {
    if (validateOptions(tempOptions)) {
      updateOptions(tempOptions.filter((option) => option.trim() !== ''));
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      handleOptionChange(event, index);
      event.target.blur();
    }
  };

  const addOption = () => {
    if (tempOptions.length < 6) {
      setTempOptions([...tempOptions, '']);
    }
  };

  const removeOption = (index) => {
    if (tempOptions.length > 2) {
      const newOptions = tempOptions.filter((_, i) => i !== index);
      setTempOptions(newOptions);
    }
  };

  const handleClearOptions = () => {
    setTempOptions(['', '']);
    updateOptions([]);
  };

  return (
    <Popover onClose={handleBlur}>
      <PopoverTrigger asChild>
        <Button variant='outline'>Open Options</Button>
      </PopoverTrigger>
      <PopoverContent className='p-4'>
        <AnimatePresence>
          <div>
            <h1 className='z-10 flex justify-center bg-white p-2 font-bold'>
              Enter your decisions below!
            </h1>
            {tempOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.2 }}
                className='m-4 flex flex-row items-center justify-between gap-3'>
                <Label
                  htmlFor={`option-${index}`}
                  className='whitespace-nowrap text-center'>
                  Option <span>{index + 1}</span>
                </Label>
                <Input
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => handleOptionChange(e, index)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='flex-1'
                />
                {tempOptions.length > 2 && (
                  <Button
                    onClick={() => removeOption(index)}
                    variant='danger'
                    className='m-0 p-0'>
                    <FaRegWindowClose />
                  </Button>
                )}
              </motion.div>
            ))}
            {tempOptions.length > 2 && tempOptions.length < 6 && (
              <p className='flex justify-center text-sm italic text-gray-500'>
                You can add up to {6 - tempOptions.length} more options.
              </p>
            )}
          </div>
        </AnimatePresence>

        <div className='mt-4 flex flex-row justify-center gap-4'>
          <Button
            onClick={handleClearOptions}
            variant='danger'
            className='text-red-500'
            disabled={tempOptions.length <= 2}>
            Clear All
          </Button>
          <Button
            onClick={addOption}
            className='flex flex-row gap-1.5 border border-black p-2'
            variant='primary'
            disabled={tempOptions.length >= 6}>
            <FaPlus size={12} />
            Add Option
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DecisionInput;
