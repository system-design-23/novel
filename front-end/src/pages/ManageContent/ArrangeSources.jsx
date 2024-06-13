import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/utils';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Button, StrictModeDroppable } from '../../components';
import { getPlugins } from '../../apis/plugins';
import { GripVertical } from 'lucide-react';

const ArrangeSources = ({ className, ...rest }) => {
  const [visiblePlugins, setVisiblePlugins] = useState(null);
  const plugins = useRef(null);
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;
    const fetchSuppliers = async () => {
      isFetching.current = true;
      const result = await getPlugins();
      if (result) {
        plugins.current = result;
        setVisiblePlugins(result);
      }
    };
    fetchSuppliers();

    return () => {
      isFetching.current = false;
    };
  }, []);

  const handleRollback = () => {
    setVisiblePlugins(plugins.current);
  };

  // const debounce = (func, delay) => {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(null, args);
  //     }, delay);
  //   };
  // };

  // const handleUpdateStage = debounce(async (stage) => {
  //   // update supplier order
  // }, 500);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(visiblePlugins);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setVisiblePlugins(items);
  };

  return (
    <section
      className={cn('mx-auto hidden h-fit w-4/5 flex-grow rounded-lg bg-slate-50 p-6', className ?? 'block')}
      {...rest}
    >
      <h2 className='mb-2 text-lg font-semibold'>Arrange Sources</h2>
      <p className='text-sm text-slate-600'>
        Drag and drop the items to arrange the prioritized order of novel sources.{' '}
      </p>
      <section className='mt-5 h-fit overflow-y-auto'>
        {visiblePlugins && visiblePlugins.length > 0 ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <StrictModeDroppable droppableId='characters'>
              {(provided) => (
                <ul className='characters' {...provided.droppableProps} ref={provided.innerRef}>
                  {visiblePlugins &&
                    visiblePlugins.map((supplier, index) => {
                      return (
                        <Draggable key={supplier.supplier} draggableId={supplier.supplier} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <div className='py-1'>
                                <div
                                  className={cn(
                                    'h-12 w-full rounded bg-slate-100 active:shadow-lg active:shadow-slate-600/10',
                                    'border-2 border-slate-200 text-slate-800',
                                    'flex select-none items-center justify-between overflow-hidden pl-2 pr-4 hover:cursor-move'
                                  )}
                                >
                                  <div className='flex space-x-2 align-middle'>
                                    <GripVertical className='opacity-40' scale='1rem' />
                                    <p className='self-center text-sm'> {supplier.supplier} </p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </ul>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        ) : (
          <div className='flex h-fit w-full justify-center p-4'>
            <p className='animate-pulse text-slate-600'>Loading</p>
          </div>
        )}
      </section>
      <section className='mt-4 flex justify-end space-x-2'>
        <Button
          variant='secondary'
          onClick={() => {
            handleRollback();
          }}
        >
          Reset
        </Button>
        <Button>Update</Button>
      </section>
    </section>
  );
};

export default ArrangeSources;
