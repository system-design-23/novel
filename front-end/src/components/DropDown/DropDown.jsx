import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';

export default function DropDown({ onOptionSelect, options, children, isOpen, onOpenChange }) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='mr-4 min-w-[150px] rounded-lg bg-slate-50 p-0 align-middle'>
        {options.map((option) => (
          <div
            key={option.value}
            className='space-4  m-2 flex h-fit cursor-pointer p-2 px-3 hover:bg-sky-200/20'
            onClick={() => {
              onOptionSelect(option.value);
              onOpenChange(false);
            }}
          >
            <p>{option.label}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
