import * as React from 'react';
import { cn } from '../../utils/utils';
import { Input } from '../../components';
import { Check, ChevronsUpDown, Menu, Search } from 'lucide-react';
import { Button } from '..';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/Popover/Popover';

const SearchBar = ({ onSearchFilterChange, onSearchValueChange, ...rest }) => {
  return (
    <div className='relative'>
      <Input {...rest} className={cn('rounded-lg pl-40', rest ? rest.className ?? '' : '')}></Input>
      <Search size={'1rem'} className='absolute right-4 top-1/2 -translate-y-1/2'></Search>
      <div className='rounded-large absolute left-0 top-1/2 -translate-y-1/2 rounded-r-none'>
        <SearchFilter onSearchFilterChange={onSearchFilterChange} />
      </div>
    </div>
  );
};

const options = [
  {
    value: 'novel_name',
    label: 'Novel Name'
  },
  {
    value: 'writer',
    label: 'Writer Name'
  },
  {
    value: 'year',
    label: 'Publish Year'
  }
];

const SearchFilter = ({ onSearchFilterChange }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(options[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='secondary'
          role='combobox'
          aria-expanded={open}
          className='rounded-large h-9 w-36 rounded-r-none border-[1px] border-primary/15'
        >
          <p>{value.label}</p>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='mr-4 w-fit rounded-lg bg-slate-50 p-0 align-middle text-sm'>
        {options.map((filterName) => (
          <div
            key={filterName.value}
            className='space-4  m-2 flex h-fit cursor-pointer p-2 px-3 hover:bg-sky-200/20'
            onClick={() => {
              onSearchFilterChange(filterName.value);
              setValue(filterName);
              setOpen(false);
            }}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4 self-center ',
                value.value === filterName.value ? 'opacity-100' : 'opacity-0'
              )}
            />
            <p>{filterName.label}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
