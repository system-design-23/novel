import { useEffect, useRef, useState } from 'react';
import { cn, debounce } from '../../utils/utils';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { Button, LoadingSpinner, StrictModeDroppable } from '../../components';
import { getPluginsOrder, updatePluginsOrder } from '../../apis/plugins';
import { GripVertical, Minus, Plus } from 'lucide-react';
import emptyImage from '../../assets/empty.png';
import { useToast } from '../../hooks/useToast';

const ArrangeSources = ({ className, ...rest }) => {
  const [visiblePlugins, setVisiblePlugins] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const plugins = useRef(null);
  const { toast } = useToast();
  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current) return;
    const fetchSuppliers = async () => {
      isFetching.current = true;
      const result = await getPluginsOrder();
      if (result) {
        plugins.current = { prefs: Array.from(result.prefs), others: Array.from(result.others) };
        setVisiblePlugins(result);
      }
    };
    fetchSuppliers();

    return () => {
      isFetching.current = false;
    };
  }, []);

  const handleRollback = () => {
    setVisiblePlugins({ prefs: Array.from(plugins.current.prefs), others: Array.from(plugins.current.others) });
  };

  const handleSwitchList = (supplier) => {
    const newVisiblePlugins = { ...visiblePlugins };
    const index = newVisiblePlugins.prefs.indexOf(supplier);
    if (index > -1) {
      newVisiblePlugins.prefs.splice(index, 1);
      newVisiblePlugins.others.push(supplier);
    } else {
      newVisiblePlugins.others = newVisiblePlugins.others.filter((item) => item !== supplier);
      newVisiblePlugins.prefs.push(supplier);
    }
    setVisiblePlugins(newVisiblePlugins);
  };

  const handleUpdateStage = debounce(async (stage) => {
    setIsUpdating(true);
    try {
      const result = await updatePluginsOrder(stage);
      if (result) {
        toast({ title: 'Success', description: 'Successfully updated the sources.' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update the sources.' });
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }, 500);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(visiblePlugins.prefs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setVisiblePlugins((prev) => ({ ...prev, prefs: items }));
  };

  return (
    <section className={cn('mx-auto h-fit w-4/5 flex-grow rounded-lg bg-slate-50 p-6', className ?? 'block')} {...rest}>
      <h2 className='mb-2 text-lg font-semibold'>Arrange Sources</h2>
      <p className='text-sm text-slate-600'>
        Drag and drop the items to arrange the prioritized order of novel sources.{' '}
      </p>
      <section className='mt-5 h-fit py-2'>
        {visiblePlugins ? (
          <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <StrictModeDroppable droppableId='characters'>
                {(provided) => (
                  <ul
                    className='characters min-h-[200px] space-y-1 rounded border-[1px] border-primary/10 p-1'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {visiblePlugins && visiblePlugins.prefs && visiblePlugins.prefs.length > 0 ? (
                      visiblePlugins.prefs?.map((supplier, index) => {
                        return (
                          <Draggable key={supplier} draggableId={supplier} index={index}>
                            {(provided) => (
                              <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div>
                                  <div
                                    className={cn(
                                      'h-12 w-full rounded bg-slate-100 active:shadow-lg active:shadow-slate-600/10',
                                      'border-2 border-slate-200 text-slate-800',
                                      'flex select-none items-center justify-between overflow-hidden pl-2 pr-4 hover:cursor-move'
                                    )}
                                  >
                                    <div className='flex w-full justify-start py-2 align-middle'>
                                      <GripVertical className='mr-4 self-center opacity-40' scale='1rem' />
                                      <p className='self-center text-sm'> {supplier} </p>
                                      <Button
                                        variant='secondary'
                                        className='ml-auto mr-0 self-center'
                                        onClick={() => {
                                          handleSwitchList(supplier);
                                        }}
                                      >
                                        <Minus className='opacity-40' size='1rem'></Minus>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )}
                          </Draggable>
                        );
                      })
                    ) : (
                      <div className='mx-auto my-auto w-[400px]'>
                        <img className='mx-auto w-[200px]' src={emptyImage} alt='empty'></img>
                        <p className='-mt-4 mb-6 w-full self-center text-center text-sm text-slate-600'>
                          Add your favorite source from below.
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </ul>
                )}
              </StrictModeDroppable>
            </DragDropContext>
            <section className='my-4 flex space-x-4 align-middle'>
              {visiblePlugins.others &&
                visiblePlugins.others.map((supplier) => {
                  return (
                    <Button
                      variant='secondary'
                      key={supplier}
                      className='flex justify-between space-x-2'
                      onClick={() => {
                        handleSwitchList(supplier);
                      }}
                    >
                      <Plus size='1rem' />
                      <p className='text-sm text-slate-800'>{supplier}</p>
                    </Button>
                  );
                })}
            </section>
          </>
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
        <Button
          className='flex space-x-2 align-middle'
          onClick={() => {
            handleUpdateStage(visiblePlugins.prefs);
          }}
        >
          {isUpdating && <LoadingSpinner className='h-4 w-4 self-center' />}
          <p>Update</p>
        </Button>
      </section>
    </section>
  );
};

export default ArrangeSources;
