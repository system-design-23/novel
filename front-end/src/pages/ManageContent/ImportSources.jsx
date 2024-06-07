import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/utils';
import { Button, LoadingSpinner } from '../../components';
import { getPlugins } from '../../apis/plugins';

const ImportSources = ({ className, ...rest }) => {
  const [visiblePlugins, setVisiblePlugins] = useState([]);
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;
    const fetchSuppliers = async () => {
      isFetching.current = true;
      const result = await getPlugins();
      if (result) {
        setVisiblePlugins(result);
      }
    };
    fetchSuppliers();

    return () => {
      isFetching.current = false;
    };
  }, []);

  return (
    <section className={cn('mx-auto hidden w-4/5 flex-grow rounded-lg bg-slate-50 p-6', className ?? '')} {...rest}>
      <h2 className='mb-2 text-lg font-semibold'>Import Sources</h2>
      <p className='text-sm text-slate-600'>Edit or add new novel supplier plugin into the system.</p>
      <section className='justify-left mt-5 flex space-x-4 overflow-x-auto'>
        {visiblePlugins.length > 0 ? (
          visiblePlugins &&
          visiblePlugins.map((supplier) => {
            return (
              <div
                className={cn(
                  'h-12 w-fit rounded bg-slate-100',
                  'border-2 border-slate-200 text-slate-800',
                  'flex select-none items-center justify-between overflow-hidden px-8'
                )}
              >
                <div className='flex space-x-2 align-middle'>
                  <p className='self-center text-sm'> {supplier.supplier} </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className='flex h-full items-center justify-center'>
            <LoadingSpinner />
          </div>
        )}
      </section>
      <section className='mb-2 mt-4 aspect-video w-full rounded bg-white'></section>
      <section className='mt-4 flex justify-end space-x-2'>
        <Button variant='secondary'>Cancel</Button>
        <Button>Update</Button>
      </section>
    </section>
  );
};

export default ImportSources;
