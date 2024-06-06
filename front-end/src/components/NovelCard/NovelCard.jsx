import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/utils';
import { Link } from 'react-router-dom';
import { Skeleton, LoadingSpinner } from '../../components';

const NovelCard = ({ ...props }) => {
  return (
    <Link
      to={`/${props.id}/detail`}
      className={cn(
        'relative my-2 mr-4 aspect-card h-fit w-[140px] overflow-hidden rounded-lg hover:scale-[1.01] md:w-[200px]',
        'transition-all duration-100 active:scale-[0.99]',
        ...(props ? props.className ?? '' : '')
      )}
    >
      <div className={cn('absolute left-0 top-0 -z-10 flex h-[calc(100%-5rem)] w-full justify-center rounded-t-lg')}>
        <LoadingSpinner className='size-1/5 self-center fill-slate-400'></LoadingSpinner>
      </div>
      <div
        style={{ backgroundImage: `url(${props.url})` }}
        className={cn(props.url ? 'h-[calc(100%-5rem)] rounded-t-lg bg-cover bg-center' : 'opacity-0')}
      ></div>
      <div className='absolute bottom-0 left-0 flex h-20 w-full justify-between overflow-hidden rounded-b-lg bg-gradient-to-tl from-slate-300 to-slate-50 p-4 align-middle hover:bg-gradient-to-tr hover:from-slate-300/50'>
        <div className='w-full self-center overflow-hidden'>
          <div className='overflow-hidden text-ellipsis text-nowrap text-[1.1rem] font-semibold leading-5'>
            {props.name}
          </div>
          <div className='overflow-hidden text-ellipsis text-nowrap text-sm font-normal text-slate-600 opacity-80'>
            {props.author}
          </div>
        </div>
        <ChevronRight className='self-center stroke-slate-600' />
      </div>
    </Link>
  );
};

export const CardLayout = () => {
  return <Skeleton className='my-2 mr-4 aspect-card w-[140px] md:w-[200px]'></Skeleton>;
};

export default NovelCard;
