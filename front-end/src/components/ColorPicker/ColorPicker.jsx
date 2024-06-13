import { useState } from 'react';
import { cn } from '../../utils/utils';

const ColorPicker = ({ onColorChange, defaultValue, ...props }) => {
  const [value, setValue] = useState(defaultValue ?? '#000000');
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md hover:scale-[1.03] active:scale-[0.97] ',
        ' ring-offset-background focus-visible:ring-ring text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
        ' focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ',
        'text-secondary-foreground aspect-square h-10 w-10 overflow-hidden rounded-full bg-secondary p-2 hover:bg-secondary/80'
      )}
      {...props}
    >
      <div style={{ backgroundColor: value }} className='h-full w-full rounded-full'>
        <input
          type='color'
          value={value}
          onChange={(e) => {
            onColorChange(e.target.value);
            setValue(e.target.value);
          }}
          className='h-full w-full opacity-0'
        ></input>
      </div>
    </div>
  );
};

export default ColorPicker;
