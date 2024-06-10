import { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { PreferencesContext } from '../../contexts/Preferences';
import { Button, ColorPicker, DropDown, LoadingSpinner, Select } from '../../components';
import { cn, convertPreferenceToStyle } from '../../utils/utils';
import { AArrowDown, AArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getChapterContent } from '../../apis/novel';
import LineHeight from '../../components/LineHeight/LineHeight';

const fontOptions = [
  { value: 'Merriweather', label: 'Serif' },
  { value: 'Inter', label: 'Sans-serif' }
];

const NovelReader = () => {
  const [chapterDetail, setChapterDetail] = useState({});
  const [preferences, setPreferences] = useContext(PreferencesContext);
  const [searchParams, _] = useSearchParams();
  const fetching = useRef(false);
  const { novelId = '', chapterId = '' } = useParams();
  const domainName = searchParams.get('domain_name');

  useEffect(() => {
    const getChapterDetail = async () => {
      const result = await getChapterContent(novelId, chapterId, domainName);
      if (result) {
        setChapterDetail(result);
      }
    };
    if (fetching.current === false) {
      fetching.current = true;
      getChapterDetail();
    }

    return () => {
      fetching.current = false;
    };
  }, [novelId, chapterId, domainName]);

  const handleFontChange = (value) => {
    setPreferences((prev) => {
      return {
        ...prev,
        fontFamily: value
      };
    });
  };

  const handleFontResize = (increase) => {
    setPreferences((prev) => {
      return {
        ...prev,
        fontSize: prev.fontSize + (increase ? 1 : -1)
      };
    });
  };

  const switchLineSpread = (value) => {
    setPreferences((prev) => {
      return {
        ...prev,
        lineHeight: value
      };
    });
  };

  const handleBackgroundColorChange = (value) => {
    setPreferences((prev) => {
      return {
        ...prev,
        backgroundColor: value
      };
    });
  };

  const handleForegroundColorChange = (value) => {
    setPreferences((prev) => {
      return {
        ...prev,
        color: value
      };
    });
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-slate-200'>
      <section className='max-w-screen flex justify-between overflow-x-auto overflow-y-hidden p-4'>
        <div className='flex h-fit flex-grow flex-nowrap space-x-4 text-nowrap pr-4 align-middle'>
          <Link className='self-center' to={chapterDetail ? `/${chapterDetail.novel_id}/detail` : '/home'}>
            <ChevronLeft />
          </Link>
          {/* info section */}
          <div className='h-fit'>
            <h2 className='text-lg font-bold'>{chapterDetail.novel_name ?? 'Unknown'}</h2>
            <p className='text-sm'>{chapterDetail.author ?? 'unknown'}</p>
          </div>
        </div>
        {/* preferences section */}
        <div className='flex min-w-[50%] flex-nowrap justify-end space-x-2 overflow-x-auto'>
          <Select
            className='self-center rounded-full border-none'
            contentClassName='w-[150px] text-sm'
            options={fontOptions}
            onSelectChange={handleFontChange}
            defaultValue={preferences.fontFamily}
          ></Select>
          <Button
            variant='secondary'
            rounded='full'
            className='aspect-square rounded-full p-2'
            onClick={() => {
              handleFontResize(true);
            }}
          >
            <AArrowUp />
          </Button>
          <Button
            variant='secondary'
            className='aspect-square rounded-full p-2'
            onClick={() => {
              handleFontResize(false);
            }}
          >
            <AArrowDown />
          </Button>
          <LineHeight defaultValue={preferences.lineHeight} onLineHeightChange={switchLineSpread}></LineHeight>
          <ColorPicker
            defaultValue={preferences.backgroundColor}
            onColorChange={handleBackgroundColorChange}
          ></ColorPicker>
          <ColorPicker defaultValue={preferences.color} onColorChange={handleForegroundColorChange}></ColorPicker>
        </div>
      </section>
      <section className='h-full flex-grow overflow-y-auto p-4'>
        <pre
          className='h-full w-full overflow-y-auto text-wrap rounded-lg p-4 px-[10%] pb-20'
          style={convertPreferenceToStyle(preferences)}
        >
          {chapterDetail.content ? <p>{chapterDetail.content}</p> : <LoadingSpinner></LoadingSpinner>}
        </pre>
      </section>
      <ChapterSection chapterDetail={chapterDetail}></ChapterSection>
    </div>
  );
};

const ChapterSection = ({ chapterDetail }) => {
  const [isListOpen, setListOpen] = useState(false);
  const { novelId = '' } = useParams();
  const [_, setSearchParams] = useSearchParams();
  const supplierOptions = useMemo(() => {
    if (chapterDetail.suppliers) {
      return chapterDetail.suppliers.map((supplier) => {
        return { value: supplier, label: supplier };
      });
    }
    return [];
  }, [chapterDetail]);

  const handleOptionSelect = (value) => {
    setSearchParams(createSearchParams({ domain_name: value }));
  };

  if (supplierOptions) {
    return (
      <section className='absolute bottom-4 left-0 right-0 mx-auto flex w-fit justify-between rounded-t-3xl bg-slate-200 p-2 align-middle'>
        <svg
          width='10'
          height='10'
          viewBox='0 0 10 10'
          className='absolute bottom-0 left-0 h-6 w-6 origin-center -translate-x-full fill-slate-200'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M0 10C5.52283 10 10 5.52285 10 0V10H0Z' />
        </svg>
        <Link
          to={chapterDetail.pre_chapter ? `/${novelId}/read/${chapterDetail.pre_chapter.id}` : '#'}
          className='roudned-full aspect-square self-center rounded-full p-2 hover:bg-slate-200/10'
        >
          <ChevronLeft className={cn(!chapterDetail.pre_chapter ?? 'cursor-not-allowed opacity-50')}></ChevronLeft>
        </Link>
        <DropDown
          isOpen={isListOpen}
          onOpenChange={setListOpen}
          options={supplierOptions}
          onOptionSelect={handleOptionSelect}
          sideOffset={15}
          className='text-sm'
          popupHeader='Select Novel Source'
        >
          <div
            className='relative flex cursor-pointer flex-col justify-center px-4 align-middle'
            role='combobox'
            aria-expanded={open}
          >
            <p className='absolute -bottom-3 left-0 right-0 mx-auto w-fit origin-top rounded-full border-[1px] border-primary/60 px-4 text-center text-[0.7rem] text-primary/60 hover:bg-slate-300'>
              {chapterDetail.supplier ?? 'Unknown Source'}
            </p>
            <p className='text-center text-sm'>{chapterDetail.chapter_name ?? 'Current Chapter'}</p>
          </div>
        </DropDown>
        <Link
          to={chapterDetail.next_chapter ? `/${novelId}/read/${chapterDetail.next_chapter.id}` : '#'}
          className='roudned-full aspect-square self-center rounded-full p-2 hover:bg-slate-200/10'
        >
          <ChevronRight className={cn(!chapterDetail.next_chapter ?? 'cursor-not-allowed opacity-50')}></ChevronRight>
        </Link>
        <svg
          width='10'
          height='10'
          viewBox='0 0 10 10'
          className='absolute bottom-0 right-0 h-6 w-6 origin-center translate-x-full fill-slate-200'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M0 0V10H10C4.47717 10 0 5.52286 0 0Z' />
        </svg>
      </section>
    );
  }
  return null;
};

export default NovelReader;
