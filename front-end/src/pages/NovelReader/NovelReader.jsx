import { useState, useContext, useRef, useEffect } from 'react';
import { PreferencesContext } from '../../contexts/Preferences';
import { Button, ColorPicker, Select } from '../../components';
import { convertPreferenceToStyle } from '../../utils/utils';
import { AArrowDown, AArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getChapterContent } from '../../apis/novel';
import LineHeight from '../../components/LineHeight/LineHeight';

const fontOptions = [
  { value: 'Merriweather', label: 'Serif' },
  { value: 'Inter', label: 'Sans-serif' }
];

const NovelReader = () => {
  const [chapterDetail, setChapterDetail] = useState({});
  const [preferences, setPreferences] = useContext(PreferencesContext);
  const fetching = useRef(false);
  const { novelId = '', chapterId = '' } = useParams();

  useEffect(() => {
    const getChapterDetail = async () => {
      const result = await getChapterContent(novelId, chapterId);
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
  }, [novelId, chapterId]);

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
        <div className='flex h-fit flex-nowrap space-x-4 align-middle'>
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
        <div className='flex flex-nowrap justify-center space-x-2'>
          <Select
            className='self-center rounded-full border-none'
            contentClassName='w-[150px] text-sm'
            options={fontOptions}
            onSelectChange={handleFontChange}
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
          <LineHeight onLineHeightChange={switchLineSpread}></LineHeight>
          <ColorPicker defaultValue='#000000' onColorChange={handleBackgroundColorChange}></ColorPicker>
          <ColorPicker defaultValue='#ffffff' onColorChange={handleForegroundColorChange}></ColorPicker>
        </div>
      </section>
      <section className='h-full flex-grow overflow-y-auto p-4'>
        <pre
          className='h-full w-full overflow-y-auto text-wrap rounded-lg p-4 px-[10%] pb-20'
          style={convertPreferenceToStyle(preferences)}
        >
          {chapterDetail ? chapterDetail.content : ''}
        </pre>
      </section>
      <section className='absolute bottom-6 left-0 right-0 mx-auto flex w-fit justify-between rounded-full bg-primary p-2 px-0 text-white'>
        <Link
          to={chapterDetail.previous_chapter ? `/${novelId}/read/${chapterDetail.previous_chapter.id}` : '#'}
          className='roudned-full pl-1 pr-2'
        >
          {chapterDetail.previous_chapter && <ChevronLeft></ChevronLeft>}
        </Link>
        <div className='px-4'>{chapterDetail.chapter_name ?? 'Current Chapter'}</div>
        <Link
          to={chapterDetail.next_chapter ? `/${novelId}/read/${chapterDetail.next_chapter.id}` : '#'}
          className='roudned-full pl-2 pr-1'
        >
          {chapterDetail.next_chapter && <ChevronRight></ChevronRight>}
        </Link>
      </section>
    </div>
  );
};

export default NovelReader;
