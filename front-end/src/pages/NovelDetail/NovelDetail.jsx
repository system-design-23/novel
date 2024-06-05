import { cn } from '../../utils/utils';
import { Button } from '../../components';
import { useState, useEffect, useRef } from 'react';
import { getNovelDetail } from '../../apis/novel';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const NovelDetail = ({ ...props }) => {
  const [novelDetail, setNovelDetail] = useState({});
  const { novelId } = useParams();
  const fetching = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getNovelInfo = async () => {
      const receiveNovelInfo = await getNovelDetail(novelId);
      if (receiveNovelInfo) {
        setNovelDetail(receiveNovelInfo);
      }
    };
    if (fetching.current == false) {
      fetching.current = true;
      getNovelInfo();
    }

    return () => {
      fetching.current = false;
    };
  }, [novelId]);

  return (
    <div {...props} className={cn('space-y-4 p-4', props ? props.className ?? '' : '')}>
      <section className='mx-auto flex max-w-[70%] flex-nowrap space-x-4 overflow-auto rounded-lg bg-slate-50 p-4 align-middle shadow-xl shadow-slate-300/20'>
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
      </section>
      <section className='mx-auto max-w-[70%] rounded-lg bg-slate-50 p-6'>
        {novelDetail.chapters &&
          novelDetail.chapters.map((chapter) => (
            <div key={chapter.id} className='my-2 flex flex-nowrap justify-between rounded-lg bg-slate-100 pl-4'>
              <div className='font-semimbold self-center text-primary'>{chapter.title}</div>
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
          ))}
      </section>
    </div>
  );
};

export default NovelDetail;
