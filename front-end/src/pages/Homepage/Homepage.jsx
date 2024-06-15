import { cn } from '../../utils/utils';
import { NovelCard, SearchBar, RecentItems, CardLayout } from '../../components';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getNovels } from '../../apis/novel';

const Homepage = ({ ...props }) => {
  const [novelList, setNovelList] = useState(null);
  const [searchOption, setSearchOption] = useState('title');
  const [searchTerm, setSearchTerm] = useState('');
  const lastFetchedPageIndex = useRef(-1);
  const isFetching = useRef(false);
  const [pageOffset, setPageOffset] = useState(0);
  const sentinelRef = useRef();

  useEffect(() => {
    let isMounted = true;

    const getNovelList = async (currentPage) => {
      isFetching.current = true;
      try {
        const receiveNovelList = await getNovels(currentPage);
        if (receiveNovelList && isMounted) {
          setNovelList((prev) => {
            if (!prev) return receiveNovelList;
            return {
              ...prev,
              novels: [...prev.novels, ...receiveNovelList.novels],
              total_pages: receiveNovelList.total_pages
            };
          });
          lastFetchedPageIndex.current = currentPage;
        }
      } finally {
        if (isMounted) {
          isFetching.current = false;
        }
      }
    };
    console.log(lastFetchedPageIndex.current, pageOffset, novelList);
    if (lastFetchedPageIndex.current < pageOffset || lastFetchedPageIndex.current === -1) {
      getNovelList(pageOffset);
    }

    return () => {
      isMounted = false;
      isFetching.current = false;
    };
  }, [pageOffset, searchOption, lastFetchedPageIndex.current]);

  const handleIntersection = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching.current && searchTerm === '') {
        setPageOffset((prev) => {
          if (novelList && prev < novelList.total_pages - 1) {
            return prev + 1;
          }
          return prev;
        });
      }
    },
    [novelList]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleIntersection]);

  const handleSearchFilterChange = (value) => {
    setSearchOption(value);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleSearchTermChange = debounce(async (value) => {
    setNovelList(null);
    setSearchTerm(value);
    if (value === '' || value === null) {
      lastFetchedPageIndex.current = -1;
      setPageOffset(0);
      return;
    }
    const result = await getNovels(0, value, searchOption);
    if (result) {
      setNovelList(result);
      lastFetchedPageIndex.current = 0;
      setPageOffset(0);
    }
  }, 500);

  return (
    <div {...props} className={cn('h-full', props ? props.className ?? '' : '')}>
      <section className='relative h-full overflow-y-auto px-4 pb-12 pt-4'>
        <div className='mx-auto my-2 w-full pb-10'>
          <SearchBar
            className='mx-auto w-full '
            placeholder='Search for a novel'
            onSearchFilterChange={handleSearchFilterChange}
            onSearchValueChange={handleSearchTermChange}
          />
        </div>
        <div className='relative flex flex-col-reverse lg:flex-row'>
          <div className='flex-grow basis-3/5'>
            <div className='flex flex-wrap'>
              {novelList
                ? novelList.novels &&
                  novelList.novels.map((novel) => (
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
          <RecentItems className='top-0 flex-grow lg:sticky lg:max-w-[30%]' />
        </div>
        <div ref={sentinelRef} className='sentinel'></div>
      </section>
    </div>
  );
};

export default Homepage;
