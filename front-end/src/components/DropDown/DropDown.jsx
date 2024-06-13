import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';
import { cn } from '../../utils/utils';

export default function DropDown({ onOptionSelect, options, children, isOpen, onOpenChange, popupHeader, ...rest }) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent {...rest} className={cn('rounded-lg bg-slate-50 p-0', rest ? rest.className ?? '' : '')}>
        {popupHeader && <h1 className='p-4 pb-0 text-base font-semibold'>{popupHeader}</h1>}
        {options.map((option) => (
          <div
            key={option.value}
            className='space-4  m-2 flex h-fit cursor-pointer rounded p-2 px-3 hover:bg-sky-200/20'
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
