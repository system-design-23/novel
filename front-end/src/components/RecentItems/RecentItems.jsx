import { cn } from '../../utils/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getRecentNovels } from '../../apis/novel';
import Skeleton from '../Skeleton/Skeleton';
import useAuth from '../../hooks/useAuth';
import emptyImage from '../../assets/empty.png';

const RecentItems = ({ ...props }) => {
  const { user } = useAuth();
  const [recentItems, setRecentItems] = useState();
  const fetching = useRef(false);
  useEffect(() => {
    const getRecentNovelItems = async () => {
      const receiveNovelItems = await getRecentNovels();
      if (receiveNovelItems) {
        setRecentItems(receiveNovelItems);
      }
    };
    if (fetching.current == false && user) {
      fetching.current = true;
      getRecentNovelItems();
    }

    return () => {
      fetching.current = false;
    };
  }, [user]);

  return (
    <div
      {...props}
      className={cn(
        'flex max-h-[500px] flex-col rounded-lg border-[1px] border-primary/10 bg-white/30 p-4 shadow-2xl shadow-slate-400/5 transition-all duration-100 hover:shadow-sky-600/10',
        props ? props.className ?? '' : ''
      )}
    >
      <h1 className='my-4 ml-2 text-xl font-bold'>Recently Read</h1>
      {user ? (
        recentItems ? (
          recentItems.map((item) => {
            return <RecentItem key={`${item.id}-${item.chapter.id}`} item={item}></RecentItem>;
          })
        ) : (
          <RecentItemLayout />
        )
      ) : (
        <div className='align-center mx-auto flex w-1/2 flex-grow flex-col justify-center text-center'>
          <p>Please log in to see your recently read chapters</p>
          <img src={emptyImage} className='mx-auto w-full' alt='empty'></img>
        </div>
      )}
    </div>
  );
};

export const RecentItemLayout = ({ ...props }) => {
  return (
    <div {...props} className={cn('max-h-[500px] w-full min-w-72', props ? props.className ?? '' : '')}>
      {[...Array(3)].map((_, index) => (
        <Skeleton key={index} className=' my-2 flex w-full justify-between p-4'></Skeleton>
      ))}
    </div>
  );
};

const RecentItem = ({ item, ...props }) => {
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
          <p className='overflow-hidden text-ellipsis text-nowrap'>{item.chapter.title}</p>
          <div className='ml-auto w-[1rem]'>
            <ChevronRight size='1rem' className='ml-2 self-center' />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecentItems;
