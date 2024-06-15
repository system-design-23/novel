import { cn } from '../../utils/utils';
import { Button, Select, Skeleton } from '../../components';
import { useState, useEffect, useRef, useMemo } from 'react';
import { getNovelDetail } from '../../apis/novel';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BookOpen, ChevronRight } from 'lucide-react';

const NovelDetail = ({ ...props }) => {
  const [novelDetail, setNovelDetail] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { novelId } = useParams();
  const fetching = useRef(false);
  const domainName = searchParams.get('domain_name');
  useEffect(() => {
    const getNovelInfo = async () => {
      const receiveNovelInfo = await getNovelDetail(novelId, domainName);
      if (receiveNovelInfo) {
        setNovelDetail(receiveNovelInfo);
      }
    };
    if (fetching.current == false && novelId) {
      fetching.current = true;
      getNovelInfo();
    }

    return () => {
      fetching.current = false;
    };
  }, [novelId, searchParams]);

  const supplyOptions = useMemo(() => {
    if (!novelDetail) return [];
    return novelDetail.suppliers
      ? novelDetail.suppliers.map((supplier) => {
          return { value: supplier, label: supplier };
        })
      : [];
  }, [novelDetail]);

  // change query params path domain_name to match selected value
  const changeSupplyParams = (value) => {
    setNovelDetail(null);
    setSearchParams(createSearchParams({ domain_name: value }));
  };

  return (
    <div {...props} className={cn('space-y-4 p-4', props ? props.className ?? '' : '')}>
      {novelDetail ? (
        <section className='relative mx-auto max-w-[70%] overflow-auto rounded-lg bg-slate-50 p-6 align-middle shadow-xl shadow-slate-300/20'>
          <div className='flex space-x-4'>
            <div
              style={{ backgroundImage: `url(${novelDetail.url})` }}
              className='mr-4 min-w-[200px] rounded-lg bg-cover bg-no-repeat'
            ></div>
            <div className='flex-grow'>
              <div className='max-w-[calc(100%-200px)] text-wrap text-3xl font-bold text-primary'>
                {novelDetail.name}
              </div>
              <div className='opacity-90'>{novelDetail.author}</div>
              <div className='my-4 flex w-full flex-wrap'>
                {novelDetail.categories &&
                  novelDetail.categories.map((category) => (
                    <div
                      key={category}
                      className='my-1 mr-2 h-fit max-w-full text-nowrap rounded-full border-[1px] border-primary/60 p-2 px-4 text-sm'
                    >
                      {category}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className='mt-3 text-[0.8rem] text-primary'>{novelDetail.description}</div>
          {supplyOptions && supplyOptions.length > 0 && (
            <Select
              className='absolute right-4 top-4'
              defaultValue={novelDetail.supplier}
              options={supplyOptions}
              onSelectChange={changeSupplyParams}
            ></Select>
          )}
        </section>
      ) : (
        <Skeleton className='mx-auto aspect-card h-[200px] w-full max-w-[70%] rounded-lg bg-cover bg-no-repeat' />
      )}

      {novelDetail ? (
        <section className='mx-auto flex max-w-[70%] flex-wrap rounded-lg bg-slate-50 p-6'>
          {novelDetail?.chapters
            ? novelDetail.chapters.map((chapter) => <ChapterItem chapter={chapter}></ChapterItem>)
            : Array.from({ length: 10 }, (_, i) => <ChapterSkeleton key={i}></ChapterSkeleton>)}
        </section>
      ) : (
        Array.from({ length: 10 }, (_, i) => <ChapterSkeleton key={i}></ChapterSkeleton>)
      )}
    </div>
  );
};

const ChapterItem = ({ chapter, ...rest }) => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  return (
    <div
      key={chapter.id}
      className={cn(
        'my-1 flex basis-[calc(50%-0.5rem)] flex-nowrap rounded-lg border-[1px] border-slate-300/50 bg-slate-100 py-1 pl-4 shadow-none transition-all duration-100  odd:mr-4',
        'cursor-pointer hover:-translate-y-1 hover:bg-slate-100/70 hover:shadow-lg hover:shadow-slate-200/50'
      )}
      {...rest}
      onClick={() => {
        navigate(`/${novelId}/read/${chapter.id}`);
      }}
    >
      <BookOpen size='1rem' className='mr-4 self-center opacity-60' />
      <div className='self-center text-sm font-medium text-primary'>{chapter.title}</div>
      <div className='mx-auto mr-0 flex space-x-2'>
        <Button
          variant='secondary'
          className='mr-2 aspect-square space-x-2 self-center rounded-full bg-transparent p-0 hover:bg-slate-200/60'
          onClick={() => {
            navigate(`/${novelId}/read/${chapter.id}`);
          }}
        >
          <ChevronRight size='1.2rem'></ChevronRight>
        </Button>
      </div>
    </div>
  );
};

const ChapterSkeleton = ({ ...props }) => {
  return (
    <Skeleton
      className='mx-auto my-2 flex h-10 w-full max-w-[70%] flex-nowrap justify-between rounded-lg pl-4'
      {...props}
    ></Skeleton>
  );
};

export default NovelDetail;
