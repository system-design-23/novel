import { cn } from '../../utils/utils';
import { NovelCard, SearchBar, RecentItems, CardLayout } from '../../components';
import { useState, useEffect, useRef } from 'react';
import { getNovels } from '../../apis/novel';

const Homepage = ({ ...props }) => {
  const [novelList, setNovelList] = useState(null);
  const fetching = useRef(false);
  useEffect(() => {
    const getNovelList = async () => {
      const receiveNovelList = await getNovels();
      if (receiveNovelList) {
        setNovelList(receiveNovelList);
      }
    };
    if (fetching.current == false) {
      fetching.current = true;
      getNovelList();
    }

    return () => {
      fetching.current = false;
    };
  }, []);

  const handleSearchFilterChange = (value) => {
    console.log(value);
    // handle search
  };

  return (
    <div {...props} className={cn('h-full', props.className ?? '')}>
      <section className='min-h-full px-4 pb-12 pt-4'>
        <div className='mx-auto my-2 w-full pb-10'>
          <SearchBar
            className='mx-auto w-full'
            placeholder='Search for a novel'
            onSearchFilterChange={handleSearchFilterChange}
          />
        </div>
        <div className='flex flex-col-reverse lg:grid lg:grid-cols-[1fr_auto]'>
          <div className=''>
            <div className='flex flex-wrap'>
              {novelList
                ? novelList.map((novel) => (
                    <NovelCard
                      key={novel.id}
                      id={novel.id}
                      name={novel.name}
                      author={novel.author}
                      url={novel.url}
                      categories={novel.categories}
                    />
                  ))
                : [...Array(8)].map((_, index) => <CardLayout key={index} />)}
            </div>
          </div>
          <RecentItems className='w-full' />
        </div>
      </section>
    </div>
  );
};

export default Homepage;
