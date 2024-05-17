'use client';

import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

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
import useMediaQuery from '../lib/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { FaRegWindowClose, FaPlus } from 'react-icons/fa';
import { ScrollArea } from '../components/ui/scroll-area';

function DecisionInput({ options, updateOptions }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [tempOptions, setTempOptions] = useState(() =>
    options.length >= 2 ? options.map((opt) => sanitizeInput(opt)) : ['', ''],
  );

  useEffect(() => {
    if (validateOptions(tempOptions)) {
      updateOptions(tempOptions.filter((option) => option.trim() !== ''));
    }
  }, [tempOptions, updateOptions]);

  useEffect(() => {
    // Disable zoom on mobile
    const disableZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', disableZoom, { passive: false });

    // Disable double-tap zoom
    const disableDoubleTapZoom = (e) => {
      e.preventDefault();
    };
    document.addEventListener('dblclick', disableDoubleTapZoom);

    return () => {
      document.removeEventListener('touchmove', disableZoom);
      document.removeEventListener('dblclick', disableDoubleTapZoom);
    };
  }, []);

  const sanitizeInput = (input) => {
    return input.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const validateOptions = (optionsArray) => {
    return optionsArray.filter((option) => option.trim() !== '').length >= 2;
  };

  const anyOptionFilled = (optionsArray) => {
    return optionsArray.some((option) => option.trim() !== '');
  };

  const allOptionsFilled = (optionsArray) => {
    return optionsArray.every((option) => option.trim() !== '');
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
    if (tempOptions.length < 6 && allOptionsFilled(tempOptions)) {
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

  const animationProps = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  };

  return (
    <div>
      {isDesktop ? (
        <div>
          <Popover onClose={handleBlur}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='bg-zinc-400 font-bold text-gray-800'>
                Open Options
              </Button>
            </PopoverTrigger>
            <PopoverContent className='p-4'>
              <h1 className='z-10 flex justify-center bg-white p-2 font-bold '>
                Enter your decisions below!
              </h1>
              <div className='flex justify-center text-center'>
                {getHeaderText()}
              </div>
              <AnimatePresence>
                {tempOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    {...animationProps}
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
                      className='flex-1 text-base'
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
              </AnimatePresence>

              <div className='mt-4 flex flex-row justify-center gap-4'>
                <Button
                  onClick={handleClearOptions}
                  variant='danger'
                  className='text-red-500'
                  disabled={!anyOptionFilled(tempOptions)}>
                  Clear All
                </Button>
                <Button
                  onClick={addOption}
                  className='flex flex-row gap-1.5 border border-black p-2'
                  variant='primary'
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
        <div>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant='outline'
                className='bg-zinc-400 font-bold text-gray-800'>
                Open Options
              </Button>
            </DrawerTrigger>
            <DrawerContent className='fixed bottom-0 left-0 right-0 flex max-h-[96%] flex-col rounded-t-[10px] bg-white'>
              <DrawerHeader className='flex flex-col justify-center gap-0.5 py-1 pb-2'>
                <DrawerTitle className='flex justify-center'>
                  Enter your decisions below!
                </DrawerTitle>
                <DrawerDescription className='flex  flex-col justify-center '>
                  <div className='flex justify-center'>{getHeaderText()}</div>
                </DrawerDescription>
              </DrawerHeader>
              {/* ------------ INPUT CONTENT START ----------*/}
              <ScrollArea className='h-auto overflow-y-auto'>
                <div className='my-2 flex flex-col gap-0.5'>
                  <AnimatePresence>
                    {tempOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        {...animationProps}
                        className='mx-5 my-1 flex h-7 flex-row items-center justify-between gap-3'>
                        <Label
                          htmlFor={`option-${index}`}
                          className='whitespace-nowrap text-center'>
                          Option <span>{index + 1}</span>
                        </Label>
                        <Input
                          id={`option-${index}`}
                          value={option}
                          onPointerDown={(e) => e.stopPropagation()}
                          onChange={(e) => handleOptionChange(e, index)}
                          onBlur={handleBlur}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          className='   '
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
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className='my-2 flex flex-row justify-center gap-4'>
                <Button
                  onClick={handleClearOptions}
                  variant='danger'
                  className='h-[32px] text-red-500'
                  disabled={!anyOptionFilled(tempOptions)}>
                  Clear All
                </Button>
                <Button
                  onClick={addOption}
                  className='flex h-[32px] flex-row border border-black p-1 '
                  variant='primary'
                  disabled={
                    tempOptions.length >= 6 || !allOptionsFilled(tempOptions)
                  }>
                  <FaPlus size={12} />
                  Add Option
                </Button>
              </div>

              {/* ------------ END INPUT  ----------*/}
              <DrawerFooter className=' pt-0'>
                <DrawerClose asChild className='h-9'>
                  <Button variant='outline'>Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}

export default DecisionInput;

// DRAWER OG - NOT WORKING PAST 4 or 5 options on mobile (keyboard in the way)
{
  /* <Drawer open={open} onOpenChange={setOpen}>
<DrawerTrigger asChild>
  <Button
    variant='outline'
    className='bg-zinc-400 font-bold text-gray-800'>
    Open Options
  </Button>
</DrawerTrigger>
<DrawerContent>
  <DrawerHeader className='flex flex-col justify-center gap-2 '>
    <DrawerTitle className='flex justify-center'>
      Enter your decisions below!
    </DrawerTitle>
    <DrawerDescription className='flex h-fit flex-col justify-center '>
      <div className='flex justify-center'>{getHeaderText()}</div>
    </DrawerDescription>
  </DrawerHeader>


  <AnimatePresence>
    {tempOptions.map((option, index) => (
      <motion.div
        key={index}
        {...animationProps}
        className='mx-5 my-0.5 flex flex-row items-center justify-between gap-3'>
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
          className='   '
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
  </AnimatePresence>
  <div className='mt-1 flex flex-row justify-center gap-4'>
    <Button
      onClick={handleClearOptions}
      variant='danger'
      className='text-red-500'
      disabled={!anyOptionFilled(tempOptions)}>
      Clear All
    </Button>
    <Button
      onClick={addOption}
      className='flex flex-row  border border-black p-0.5'
      variant='primary'
      disabled={
        tempOptions.length >= 6 || !allOptionsFilled(tempOptions)
      }>
      <FaPlus size={12} />
      Add Option
    </Button>
  </div>


  <DrawerFooter className='pt-2'>
    <DrawerClose asChild>
      <Button variant='outline'>Close</Button>
    </DrawerClose>
  </DrawerFooter>
</DrawerContent>
</Drawer> */
}

// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '../components/ui/popover';
// import { Button } from '../components/ui/button';
// import { Label } from '../components/ui/label';
// import { Input } from '../components/ui/input';

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from './ui/drawer';
// import useMediaQuery from '../lib/useMediaQuery';
// import { AnimatePresence, motion } from 'framer-motion';
// import { FaRegWindowClose, FaPlus } from 'react-icons/fa';

// function DecisionInput({ options, updateOptions }) {
//   const [open, setOpen] = useState(false);
//   const isDesktop = useMediaQuery('(min-width: 768px)');

//   const [tempOptions, setTempOptions] = useState(() =>
//     options.length >= 2 ? options.map((opt) => sanitizeInput(opt)) : ['', ''],
//   );

//   useEffect(() => {
//     if (validateOptions(tempOptions)) {
//       updateOptions(tempOptions.filter((option) => option.trim() !== ''));
//     }
//   }, [tempOptions, updateOptions]);

//   useEffect(() => {
//     // Disable zoom on mobile
//     const disableZoom = (e) => {
//       if (e.touches.length > 1) {
//         e.preventDefault();
//       }
//     };
//     document.addEventListener('touchmove', disableZoom, { passive: false });

//     // Disable double-tap zoom
//     const disableDoubleTapZoom = (e) => {
//       e.preventDefault();
//     };
//     document.addEventListener('dblclick', disableDoubleTapZoom);

//     return () => {
//       document.removeEventListener('touchmove', disableZoom);
//       document.removeEventListener('dblclick', disableDoubleTapZoom);
//     };
//   }, []);

//   const sanitizeInput = (input) => {
//     return input.replace(/<\/?[^>]+(>|$)/g, '');
//   };

//   const validateOptions = (optionsArray) => {
//     return optionsArray.filter((option) => option.trim() !== '').length >= 2;
//   };

//   const anyOptionFilled = (optionsArray) => {
//     return optionsArray.some((option) => option.trim() !== '');
//   };

//   const allOptionsFilled = (optionsArray) => {
//     return optionsArray.every((option) => option.trim() !== '');
//   };

//   const handleOptionChange = (event, index) => {
//     const sanitizedValue = sanitizeInput(event.target.value);
//     const newOptions = [...tempOptions];
//     newOptions[index] = sanitizedValue;
//     setTempOptions(newOptions);
//   };

//   const handleBlur = () => {
//     if (validateOptions(tempOptions)) {
//       updateOptions(tempOptions.filter((option) => option.trim() !== ''));
//     }
//   };

//   const handleKeyDown = (event, index) => {
//     if (event.key === 'Enter') {
//       handleOptionChange(event, index);
//       event.target.blur();
//     }
//   };

//   const addOption = () => {
//     if (tempOptions.length < 6 && allOptionsFilled(tempOptions)) {
//       setTempOptions([...tempOptions, '']);
//     }
//   };

//   const removeOption = (index) => {
//     if (tempOptions.length > 2) {
//       const newOptions = tempOptions.filter((_, i) => i !== index);
//       setTempOptions(newOptions);
//     }
//   };

//   const handleClearOptions = () => {
//     setTempOptions(['', '']);
//     updateOptions([]);
//   };

//   const animationProps = {
//     initial: { opacity: 0, y: 30 },
//     animate: { opacity: 1, y: 0 },
//     exit: { opacity: 0, y: -30 },
//     transition: { type: 'spring', stiffness: 300, damping: 30 },
//   };

//   return (
//     <div>
//       {isDesktop ? (
//         <div>
//           <Popover onClose={handleBlur}>
//             <PopoverTrigger asChild>
//               <Button variant='outline' className=''>
//                 Open Options
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className='p-4'>
//               <h1 className='z-10 flex justify-center bg-white p-2 font-bold '>
//                 Enter your decisions below!
//               </h1>
//               <AnimatePresence>
//                 {tempOptions.map((option, index) => (
//                   <motion.div
//                     key={index}
//                     {...animationProps}
//                     className='m-4 flex flex-row items-center justify-between gap-3'>
//                     <Label
//                       htmlFor={`option-${index}`}
//                       className='whitespace-nowrap text-center'>
//                       Option <span>{index + 1}</span>
//                     </Label>
//                     <Input
//                       id={`option-${index}`}
//                       value={option}
//                       onChange={(e) => handleOptionChange(e, index)}
//                       onBlur={handleBlur}
//                       onKeyDown={(e) => handleKeyDown(e, index)}
//                       className='flex-1 text-base'
//                     />
//                     {tempOptions.length > 2 && (
//                       <Button
//                         onClick={() => removeOption(index)}
//                         variant='danger'
//                         className='m-0 p-0'>
//                         <FaRegWindowClose />
//                       </Button>
//                     )}
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//               {tempOptions.length > 2 && tempOptions.length < 6 && (
//                 <p className='text-gray-500'>
//                   You can add up to {6 - tempOptions.length} more options.
//                 </p>
//               )}
//               <div className='mt-4 flex flex-row justify-center gap-4'>
//                 <Button
//                   onClick={handleClearOptions}
//                   variant='danger'
//                   className='text-red-500'
//                   disabled={!anyOptionFilled(tempOptions)}>
//                   Clear All
//                 </Button>
//                 <Button
//                   onClick={addOption}
//                   className='flex flex-row gap-1.5 border border-black p-2'
//                   variant='primary'
//                   disabled={
//                     tempOptions.length >= 6 || !allOptionsFilled(tempOptions)
//                   }>
//                   <FaPlus size={12} />
//                   Add Option
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       ) : (
//         <div>
//           <Drawer open={open} onOpenChange={setOpen}>
//             <DrawerTrigger asChild>
//               <Button variant='outline' className='bg-zinc-400 text-gray-900'>
//                 Open Options
//               </Button>
//             </DrawerTrigger>
//             <DrawerContent>
//               <DrawerHeader className='flex flex-col justify-center gap-2 '>
//                 <DrawerTitle>Enter your decisions below!</DrawerTitle>
//                 <DrawerDescription className='flex flex-col justify-center '>
//                   {tempOptions.length <= 2 ? (
//                     <h1>Add 2 options to start</h1>
//                   ) : (
//                     <h1>
//                       You can add up to {6 - tempOptions.length} more options
//                     </h1>
//                   )}

//                   {/* <h1>
//                     You can add up to {6 - tempOptions.length} more options.
//                   </h1>
//                   <h2>(2 Min, 6 Max)</h2> */}
//                 </DrawerDescription>
//               </DrawerHeader>
//               {/* ------------ INPUT CONTENT START ----------*/}
//               <div className=''>
//                 <AnimatePresence>
//                   {tempOptions.map((option, index) => (
//                     <motion.div
//                       key={index}
//                       {...animationProps}
//                       className='m-4 flex flex-row items-center justify-between gap-3'>
//                       <Label
//                         htmlFor={`option-${index}`}
//                         className='whitespace-nowrap text-center'>
//                         Option <span>{index + 1}</span>
//                       </Label>
//                       <Input
//                         id={`option-${index}`}
//                         value={option}
//                         onChange={(e) => handleOptionChange(e, index)}
//                         onBlur={handleBlur}
//                         onKeyDown={(e) => handleKeyDown(e, index)}
//                         className='flex-1 text-base'
//                       />
//                       {tempOptions.length > 2 && (
//                         <Button
//                           onClick={() => removeOption(index)}
//                           variant='danger'
//                           className='m-0 p-0'>
//                           <FaRegWindowClose />
//                         </Button>
//                       )}
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//                 {/* {tempOptions.length > 2 && tempOptions.length < 6 && (
//                   <p className='text-gray-500'>
//                     You can add up to {6 - tempOptions.length} more options.
//                   </p>
//                 )} */}
//                 <div className='mt-4 flex flex-row justify-center gap-4'>
//                   <Button
//                     onClick={handleClearOptions}
//                     variant='danger'
//                     className='text-red-500'
//                     disabled={!anyOptionFilled(tempOptions)}>
//                     Clear All
//                   </Button>
//                   <Button
//                     onClick={addOption}
//                     className='flex flex-row gap-1.5 border border-black p-2'
//                     variant='primary'
//                     disabled={
//                       tempOptions.length >= 6 || !allOptionsFilled(tempOptions)
//                     }>
//                     <FaPlus size={12} />
//                     Add Option
//                   </Button>
//                 </div>
//               </div>
//               {/* ------------ END INPUT  ----------*/}
//               <DrawerFooter className='pt-2'>
//                 <DrawerClose asChild>
//                   <Button variant='outline'>Close</Button>
//                 </DrawerClose>
//               </DrawerFooter>
//             </DrawerContent>
//           </Drawer>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DecisionInput;
