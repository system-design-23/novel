import { useState } from 'react';
import { cn } from '../../utils/utils';

const ManageContent = () => {
  const [page, setPage] = useState('importSource');
  const handlePageChange = (e) => {
    setPage(e.target.value);
  };
  return (
    <div className='p-4'>
      <h1 className='my-4 text-center text-2xl font-bold'>Manage Content</h1>
      <div className='flex h-full flex-col space-y-4 align-middle'>
        <section
          className={cn(
            'mx-auto flex h-fit w-fit flex-shrink justify-center space-x-4',
            'peer rounded-lg bg-slate-50 p-1 align-middle'
          )}
        >
          <div className='flex'>
            <input
              id='importSource'
              type='radio'
              name='page'
              value='importSource'
              className='peer hidden'
              defaultChecked
              onChange={handlePageChange}
            ></input>
            <label
              htmlFor='importSource'
              className='cursor-pointer rounded-[0.3rem] p-2 px-8 text-sm peer-checked:bg-slate-200 peer-checked:font-semibold peer-checked:text-primary'
            >
              Novel Sources
            </label>
          </div>
          <div className='flex'>
            <input
              id='exportSource'
              type='radio'
              name='page'
              value='exportSource'
              className='peer hidden'
              onChange={handlePageChange}
            ></input>
            <label
              htmlFor='exportSource'
              className='cursor-pointer rounded-[0.3rem] p-2 px-8 text-sm peer-checked:bg-slate-200 peer-checked:font-semibold peer-checked:text-primary'
            >
              Export Sources
            </label>
          </div>
        </section>
        <section
          className={cn(
            'mx-auto hidden w-4/5 flex-grow rounded-lg bg-slate-50 p-6',
            page === 'importSource' && 'block'
          )}
        >
          <h2 className='font-semibold'>Import Source</h2>
        </section>
        <section
          className={cn(
            'mx-auto hidden w-4/5 flex-grow rounded-lg bg-slate-50 p-6',
            page === 'exportSource' && 'block'
          )}
        >
          <h2 className='font-semibold'>Export Source</h2>
        </section>
      </div>
    </div>
  );
};

export default ManageContent;
