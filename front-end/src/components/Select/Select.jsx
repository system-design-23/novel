import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../../utils/utils';
import { Button } from '..';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';

export default function Select({ onSelectChange, defaultValue, options, className, contentClassName }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(
    options.find((option) => option.value == (defaultValue ?? '')) ?? options[0]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='secondary'
          role='combobox'
          aria-expanded={open}
          className={cn('rounded-large h-9 w-fit border-[1px] border-primary/15', className ?? '')}
        >
          <p>{value.label}</p>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('mr-4 rounded-lg bg-slate-50 p-0 align-middle', contentClassName ?? '')}>
        {options.map((option) => (
          <div
            key={option.value}
            className='space-4  m-2 flex h-fit cursor-pointer p-2 px-3 hover:bg-sky-200/20'
            onClick={() => {
              onSelectChange(option.value);
              setValue(option);
              setOpen(false);
            }}
          >
            <Check
              className={cn('mr-2 h-4 w-4 self-center ', value.value === option.value ? 'opacity-100' : 'opacity-0')}
            />
            <p>{option.label}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
