'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import useMediaQuery from '../lib/useMediaQuery';
import { FaRegWindowClose, FaPlus } from 'react-icons/fa';
import { useWebHaptics } from 'web-haptics/react';

function DecisionInput({ options, updateOptions }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const inputRefs = useRef([]);
  const { trigger: haptic } = useWebHaptics();

  const sanitizeInput = useCallback(
    (input) => input.replace(/<\/?[^>]+(>|$)/g, ''),
    [],
  );

  const validateOptions = useCallback(
    (optionsArray) =>
      optionsArray.filter((option) => option.trim() !== '').length >= 2,
    [],
  );

  const [tempOptions, setTempOptions] = useState(() =>
    options.length >= 2 ? options.map((opt) => sanitizeInput(opt)) : ['', ''],
  );

  useEffect(() => {
    if (validateOptions(tempOptions)) {
      updateOptions(tempOptions.filter((option) => option.trim() !== ''));
    }
  }, [tempOptions, updateOptions, validateOptions]);

  useEffect(() => {
    if (open && options.length >= 2) {
      setTempOptions(options.map((opt) => sanitizeInput(opt)));
    }
    if (open && isDesktop) {
      setTimeout(() => focusFirstOption(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const anyOptionFilled = useCallback(
    (optionsArray) => optionsArray.some((option) => option.trim() !== ''),
    [],
  );

  const allOptionsFilled = useCallback(
    (optionsArray) => optionsArray.every((option) => option.trim() !== ''),
    [],
  );

  const handleOptionChange = (event, index) => {
    const sanitizedValue = sanitizeInput(event.target.value);
    const newOptions = [...tempOptions];
    newOptions[index] = sanitizedValue;
    setTempOptions(newOptions);
  };

  const handleBlur = useCallback(() => {
    if (validateOptions(tempOptions)) {
      updateOptions(tempOptions.filter((option) => option.trim() !== ''));
    }
  }, [tempOptions, updateOptions, validateOptions]);

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      handleOptionChange(event, index);
      event.target.blur();
    }
  };

  const addOption = () => {
    if (tempOptions.length < 6 && allOptionsFilled(tempOptions)) {
      setTempOptions(['', ...tempOptions]);
      inputRefs.current[0]?.focus();
      haptic('nudge');
    }
  };

  const removeOption = (index) => {
    if (tempOptions.length > 2) {
      const newOptions = tempOptions.filter((_, i) => i !== index);
      setTempOptions(newOptions);
      haptic('nudge');
    }
  };

  const handleClearOptions = () => {
    setTempOptions(['', '']);
    updateOptions([]);
    haptic('error');
  };

  const getHeaderText = () => {
    const filledOptionsCount = tempOptions.filter(
      (option) => option.trim() !== '',
    ).length;
    if (filledOptionsCount === 0) {
      return 'Add 2 options to start';
    } else if (filledOptionsCount === 1) {
      return 'Add 1 more option to start';
    } else {
      return `You can add up to ${6 - tempOptions.length} more options`;
    }
  };

  const focusFirstOption = () => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[inputRefs.current.length - 1]?.focus();
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) handleBlur();
  };

  const handleInputFocus = (e) => {
    if (!isDesktop) {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 350);
    }
  };

  return (
    <div>
      {isDesktop ? (
        <div>
          <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button className='bg-neutral-800 font-bold text-neutral-100 hover:bg-neutral-500 active:bg-neutral-500'>
                Open Options
              </Button>
            </PopoverTrigger>
            <PopoverContent className='p-4'>
              <h1 className='z-10 flex justify-center bg-white p-2 font-bold'>
                Enter your decisions below!
              </h1>
              <div className='flex justify-center text-center'>
                {getHeaderText()}
              </div>
              {tempOptions.map((option, index) => (
                <div
                  key={index}
                  className='m-4 flex flex-row items-center justify-between gap-3'>
                  <Label
                    htmlFor={`option-${index}`}
                    className='whitespace-nowrap text-center'>
                    Option <span>{tempOptions.length - index}</span>
                  </Label>
                  <Input
                    id={`option-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                  {tempOptions.length > 2 && (
                    <Button
                      onClick={() => removeOption(index)}
                      variant='ghost'
                      className='m-0 p-0'>
                      <FaRegWindowClose />
                    </Button>
                  )}
                </div>
              ))}

              <div className='mt-4 flex flex-row justify-center gap-4'>
                <Button
                  onClick={handleClearOptions}
                  variant='ghost'
                  className='text-red-500'
                  disabled={!anyOptionFilled(tempOptions)}>
                  Clear All
                </Button>
                <Button
                  onClick={addOption}
                  className='flex flex-row gap-1.5 border border-black p-2'
                  variant='outline'
                  disabled={
                    tempOptions.length >= 6 || !allOptionsFilled(tempOptions)
                  }>
                  <FaPlus size={12} />
                  Add Option
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>
            <Button className='bg-neutral-800 font-bold text-neutral-100 hover:bg-neutral-500 active:bg-neutral-500'>
              Open Options
            </Button>
          </DrawerTrigger>
          <DrawerContent className='flex max-h-[70vh] flex-col'>
            <DrawerHeader className='shrink-0 flex flex-col justify-center gap-0.5 py-1 pb-2'>
              <DrawerTitle className='flex justify-center'>
                Enter your decisions below!
              </DrawerTitle>
              <DrawerDescription className='flex flex-col justify-center'>
                <div className='flex justify-center'>{getHeaderText()}</div>
              </DrawerDescription>
            </DrawerHeader>

            <div
              className='flex-1 overflow-y-auto overscroll-contain px-5 pb-2'
              style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}>
              {tempOptions.map((option, index) => (
                <div
                  key={index}
                  className='my-1 flex flex-row items-center justify-between gap-3'>
                  <Label
                    htmlFor={`option-${index}`}
                    className='whitespace-nowrap text-center'>
                    Option <span>{tempOptions.length - index}</span>
                  </Label>
                  <Input
                    id={`option-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={handleInputFocus}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                  {tempOptions.length > 2 && (
                    <Button
                      onClick={() => removeOption(index)}
                      variant='ghost'
                      className='m-0 p-0'>
                      <FaRegWindowClose />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className='shrink-0 flex flex-row justify-center gap-4 px-5 py-2'>
              <Button
                onClick={handleClearOptions}
                variant='ghost'
                className='h-[32px] text-red-500'
                disabled={!anyOptionFilled(tempOptions)}>
                Clear All
              </Button>
              <Button
                onClick={addOption}
                className='flex h-[32px] flex-row border border-black p-1'
                variant='outline'
                disabled={
                  tempOptions.length >= 6 || !allOptionsFilled(tempOptions)
                }>
                <FaPlus size={12} />
                Add Option
              </Button>
            </div>

            <DrawerFooter className='shrink-0 pt-0'>
              <DrawerClose asChild>
                <Button variant='outline'>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default DecisionInput;
