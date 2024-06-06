import * as React from 'react';
import { Check, ChevronsUpDown, Menu } from 'lucide-react';

import { cn } from '../../utils/utils';
import { Button } from '..';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';

const options = [
  {
    value: '0.75em',
    label: '0.75'
  },
  {
    value: '1em',
    label: '1'
  },
  {
    value: '1.25em',
    label: '1.25'
  },
  {
    value: '1.5em',
    label: '1.5'
  },
  {
    value: '2em',
    label: '2'
  },
  {
    value: '2.5em',
    label: '2.5'
  },
  {
    value: '3em',
    label: '3'
  },
  {
    value: '3.5em',
    label: '3.5'
  }
];

export default function LineHeight({ onLineHeightChange }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('1.5em');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='secondary' role='combobox' aria-expanded={open} className='w-fit justify-between rounded-full'>
          <Menu className='ml-2 h-4 w-4 shrink-0' />
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mr-4 w-[200px] rounded-lg bg-slate-50 p-0 align-middle'>
        {options.map((framework) => (
          <div
            key={framework.value}
            className='space-4  m-2 flex h-fit cursor-pointer p-2 px-3 hover:bg-sky-200/20'
            onClick={() => {
              onLineHeightChange(framework.value);
              setValue(framework.value);
              setOpen(false);
            }}
          >
            <Check
              className={cn('mr-2 h-4 w-4 self-center ', value === framework.value ? 'opacity-100' : 'opacity-0')}
            />
            <p>{framework.label}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
