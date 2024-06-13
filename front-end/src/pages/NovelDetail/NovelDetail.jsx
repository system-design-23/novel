import { cn } from '../../utils/utils';
import { Button, Select } from '../../components';
import { useState, useEffect, useRef, useMemo } from 'react';
import { getNovelDetail } from '../../apis/novel';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const NovelDetail = ({ ...props }) => {
  const [novelDetail, setNovelDetail] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const { novelId } = useParams();
  const fetching = useRef(false);
  const domainName = searchParams.get('domain_name');
  useEffect(() => {
    console.log('domain name detected to be' + domainName);
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
    return novelDetail.suppliers
      ? novelDetail.suppliers.map((supplier) => {
          return { value: supplier, label: supplier };
        })
      : [];
  }, [novelDetail]);

  // change query params path domain_name to match selected value
  const changeSupplyParams = (value) => {
    setSearchParams(createSearchParams({ domain_name: value }));
  };

  return (
    <div {...props} className={cn('space-y-4 p-4', props ? props.className ?? '' : '')}>
      <section className='relative mx-auto flex max-w-[70%] flex-nowrap space-x-4 overflow-auto rounded-lg bg-slate-50 p-4 align-middle shadow-xl shadow-slate-300/20'>
        <div
          style={{ backgroundImage: `url(${novelDetail.url})` }}
          className='mr-4 aspect-card h-[200px] rounded-lg bg-cover bg-no-repeat'
        ></div>
        <div className='flex-grow'>
          <div className='mt-4 text-3xl font-bold text-primary'>{novelDetail.name}</div>
          <div className='opacity-90'>{novelDetail.author}</div>
          <div className='my-4 flex flex-nowrap space-x-2'>
            {novelDetail.categories &&
              novelDetail.categories.map((category) => (
                <div key={category} className='h-fit rounded-full border-[1px] border-primary/60 p-2 px-4 text-sm'>
                  {category}
                </div>
              ))}
          </div>
          <div className=''>{novelDetail.description}</div>
        </div>
        {supplyOptions && supplyOptions.length > 0 && (
          <Select
            className='absolute right-4 top-4'
            defaultValue={novelDetail.supplier}
            options={supplyOptions}
            onSelectChange={changeSupplyParams}
          ></Select>
        )}
      </section>
      <section className='mx-auto max-w-[70%] rounded-lg bg-slate-50 p-6'>
        {novelDetail.chapters && novelDetail.chapters.map((chapter) => <ChapterItem chapter={chapter}></ChapterItem>)}
      </section>
    </div>
  );
};

const ChapterItem = ({ chapter, ...rest }) => {
  const { novelId } = useParams();
  const navigate = useNavigate();
  return (
    <div key={chapter.id} className='my-2 flex flex-nowrap justify-between rounded-lg bg-slate-100 pl-4' {...rest}>
      <div className='font-semimbold self-center text-primary'>{chapter.title}</div>
      <div className='flex space-x-2'>
        {/* <div className='h-fit content-center self-center rounded-full border-2 border-slate-200 px-2 py-1 text-[0.7rem]'>
        Supplier1
      </div>
      <div className='h-fit content-center self-center rounded-full border-2 border-slate-200 px-2 py-1 text-[0.7rem]'>
        Supplier2
      </div> */}
        <Button
          variant='secondary'
          className='space-x-2 self-center rounded-lg'
          onClick={() => {
            navigate(`/${novelId}/read/${chapter.id}`);
          }}
        >
          <ChevronRight size='0.8rem'></ChevronRight>
        </Button>
      </div>
    </div>
  );
};

export default NovelDetail;
