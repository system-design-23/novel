import { useState } from 'react';
import { cn } from '../../utils/utils';
import { BookUp2, FileDown, LibraryBig } from 'lucide-react';
import ArrangeSources from './ArrangeSources';
import useAuth from '../../hooks/useAuth';
import ImportSources from './ImportSources';
import ExportSources from './ExportSources';
import { useNavigate } from 'react-router-dom';

const ManageContent = () => {
  const [page, setPage] = useState('sourceArrange');
  const { user } = useAuth();
  const navigate = useNavigate();
  const handlePageChange = (e) => {
    setPage(e.target.value);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className='h-full overflow-y-auto p-4'>
      <h1 className='my-4 text-center text-2xl font-bold'>Manage Content</h1>
      <div className='flex flex-col space-y-4 align-middle'>
        <section
          className={cn(
            'mx-auto flex h-fit w-fit flex-shrink justify-center space-x-1',
            'peer rounded-lg bg-slate-50 p-1 align-middle'
          )}
        >
          <div className='flex'>
            <input
              id='sourceArrange'
              type='radio'
              name='page'
              value='sourceArrange'
              className='peer hidden'
              defaultChecked
              onChange={handlePageChange}
            ></input>
            <label
              htmlFor='sourceArrange'
              className={cn(
                'flex cursor-pointer justify-center space-x-2 rounded-[0.3rem] align-middle',
                ' p-2 px-8 text-sm peer-checked:bg-slate-200 peer-checked:font-medium peer-checked:text-primary',
                'hover:bg-slate-100'
              )}
            >
              <LibraryBig width='1rem' className='self-center' />
              <p className='self-center'>Arrange Suppliers</p>
            </label>
          </div>
          {user && user.isAdmin && (
            <>
              <div className='flex'>
                <input
                  id='importSource'
                  type='radio'
                  name='page'
                  value='importSource'
                  className='peer hidden'
                  onChange={handlePageChange}
                ></input>
                <label
                  htmlFor='importSource'
                  className={cn(
                    'flex cursor-pointer justify-center space-x-2 rounded-[0.3rem] align-middle',
                    ' p-2 px-8 text-sm peer-checked:bg-slate-200 peer-checked:font-medium peer-checked:text-primary',
                    'hover:bg-slate-100'
                  )}
                >
                  <BookUp2 width='1rem' className='self-center' />
                  <p className='self-center'>Novel Sources</p>
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
                  className={cn(
                    'flex cursor-pointer justify-center space-x-2 rounded-[0.3rem] align-middle',
                    ' p-2 px-8 text-sm peer-checked:bg-slate-200 peer-checked:font-medium peer-checked:text-primary',
                    'hover:bg-slate-100'
                  )}
                >
                  <FileDown width='1rem' className='self-center' />
                  <p className='self-center'>Export Formats</p>
                </label>
              </div>
            </>
          )}
        </section>
        {page === 'sourceArrange' && <ArrangeSources></ArrangeSources>}
        {page === 'importSource' && <ImportSources></ImportSources>}
        {page === 'exportSource' && <ExportSources></ExportSources>}
      </div>
    </div>
  );
};

export default ManageContent;
