import { cn } from '../../utils/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getRecentNovels } from '../../apis/novel';
import Skeleton from '../Skeleton/Skeleton';

const RecentItems = ({ ...props }) => {
  const [recentItems, setRecentItems] = useState();
  const fetching = useRef(false);
  useEffect(() => {
    const getRecentNovelItems = async () => {
      const receiveNovelItems = await getRecentNovels();
      if (receiveNovelItems) {
        setRecentItems(receiveNovelItems);
      }
    };
    if (fetching.current == false) {
      fetching.current = true;
      getRecentNovelItems();
    }

    return () => {
      fetching.current = false;
    };
  }, []);

  return (
    <div
      {...props}
      className={cn(
        'max-h-[500px] w-full rounded-lg border-[1px] border-primary/10 bg-white/30 p-4 shadow-2xl shadow-slate-400/5 transition-all duration-100 hover:shadow-sky-600/10 ',
        props ? props.className ?? '' : ''
      )}
    >
      <h1 className='my-4 text-xl font-bold'>Recently Read</h1>
      {recentItems
        ? recentItems.map((item) => {
            return <RecentItem key={item.novel_id} item={item}></RecentItem>;
          })
        : [...Array(3)].map((_, index) => <RecentItemLayout key={index} />)}
    </div>
  );
};

export const RecentItemLayout = ({ ...props }) => {
  return (
    <Skeleton {...props} className={cn('max-h-[500px] w-full min-w-72', props ? props.className ?? '' : '')}>
      <Skeleton className=' my-2 flex w-full justify-between p-4'></Skeleton>
    </Skeleton>
  );
};

const RecentItem = ({ ...props }) => {
  const item = props.item;
  return (
    <div
      {...props}
      className={cn(
        'my-2 flex justify-between rounded-lg border-[1px] border-primary/10 bg-white/50 p-4 shadow-xl shadow-slate-100/5',
        props ? props.className ?? '' : ''
      )}
    >
      <div>
        <p className='font-semibold'>{item.name}</p>
        <p className='text-sm'>{item.author}</p>
      </div>
      <div className='flex space-x-4'>
        <Link
          to={`/${item.id}/read/${item.chapter.id}`}
          className='mx-4 flex h-fit w-32 flex-nowrap justify-center self-center rounded-full border-[1px] border-primary/40 p-2 px-4 align-middle text-[0.75rem] text-primary hover:scale-[1.01] hover:bg-white/20 active:scale-[0.99]'
        >
          <p className='overflow-hidden text-ellipsis text-nowrap'>{item.chapter.name}</p>
          <div className='ml-auto w-[1rem]'>
            <ChevronRight size='1rem' className='ml-2 self-center' />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecentItems;
