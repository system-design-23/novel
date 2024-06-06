import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { delay } from '../utils/utils';

const NOVEL_SERVICE_URL = 'http://localhost:3000/api/v1';
const novels = [
  {
    id: '1',
    name: 'The Shadow Runner',
    author: 'Jane Doe',
    url: 'https://picsum.photos/800?random=1',
    categories: ['fantasy', 'adventure', 'young adult']
  },
  {
    id: '2',
    name: 'A Byte of Love',
    author: 'Li Wei',
    url: 'https://picsum.photos/800?random=2',
    categories: ['science fiction', 'romance', 'adult']
  },
  {
    id: '3',
    name: 'Chronicles of a Chess Master',
    author: 'Peter Ivanov',
    url: 'https://picsum.photos/800?random=3',
    categories: ['historical fiction', 'drama', 'adult']
  },
  {
    id: '4',
    name: 'Haiku of a Broken Heart',
    author: 'Hanako Nakamura',
    url: 'https://picsum.photos/800?random=4',
    categories: ['poetry', 'coming-of-age', 'young adult']
  },
  {
    id: '5',
    name: 'The Culinary Code',
    author: 'Marco Rossi',
    url: 'https://picsum.photos/800?random=5',
    categories: ['mystery', 'thriller', 'adult']
  },
  {
    id: '6',
    name: 'The Call of the Wild (retold)',
    author: 'Jack London (adapted by Sarah Johnson)',
    url: 'https://picsum.photos/800?random=6',
    categories: ['classics', 'adventure', 'all ages']
  },
  {
    id: '7',
    name: 'Data & Destiny',
    author: 'Anya Sharma',
    url: 'https://picsum.photos/800?random=7',
    categories: ['science fiction', 'dystopian', 'young adult']
  },
  {
    id: '8',
    name: "The Emperor's Decree",
    author: 'Wang Lin',
    url: 'https://picsum.photos/800?random=8',
    categories: ['historical fiction', 'political', 'adult']
  },
  {
    id: '9',
    name: 'The Shadow Runner',
    author: 'Jane Doe',
    url: 'https://picsum.photos/800?random=9',
    categories: ['fantasy', 'adventure', 'young adult']
  },
  {
    id: '10',
    name: 'A Byte of Love',
    author: 'Li Wei',
    url: 'https://picsum.photos/800?random=10',
    categories: ['science fiction', 'romance', 'adult']
  },
  {
    id: '11',
    name: 'Chronicles of a Chess Master',
    author: 'Peter Ivanov',
    url: 'https://picsum.photos/800?random=11',
    categories: ['historical fiction', 'drama', 'adult']
  },
  {
    id: '12',
    name: 'Haiku of a Broken Heart',
    author: 'Hanako Nakamura',
    url: 'https://picsum.photos/800?random=12',
    categories: ['poetry', 'coming-of-age', 'young adult']
  },
  {
    id: '13',
    name: 'The Culinary Code',
    author: 'Marco Rossi',
    url: 'https://picsum.photos/800?random=13',
    categories: ['mystery', 'thriller', 'adult']
  },
  {
    id: '14',
    name: 'The Call of the Wild (retold)',
    author: 'Jack London (adapted by Sarah Johnson)',
    url: 'https://picsum.photos/800?random=14',
    categories: ['classics', 'adventure', 'all ages']
  },
  {
    id: '15',
    name: 'Data & Destiny',
    author: 'Anya Sharma',
    url: 'https://picsum.photos/800?random=15',
    categories: ['science fiction', 'dystopian', 'young adult']
  },
  {
    id: '16',
    name: "The Emperor's Decree",
    author: 'Wang Lin',
    url: 'https://picsum.photos/800?random=16',
    categories: ['historical fiction', 'political', 'adult']
  }
];

const novelDetail = {
  name: 'The Indigo Spell',
  author: 'Isadora Moon',
  url: 'https://picsum.photos/800?random=1',
  categories: ['fantasy', 'magic', 'young adult'],
  description: 'A young witch discovers a hidden power that could change the fate of her kingdom.',
  chapters: [
    {
      id: '1',
      title: 'The Awakening'
    },
    {
      id: '2',
      title: 'The Forbidden Forest'
    },
    {
      id: '3',
      title: 'The Secret Potion'
    },
    {
      id: '4',
      title: 'The Shadow Master'
    },
    {
      id: '5',
      title: 'The Prophecy Revealed'
    },
    {
      id: '6',
      title: 'The Trial of Magic'
    },
    {
      id: '7',
      title: 'The Final Battle'
    },
    {
      id: '8',
      title: 'A New Dawn'
    }
  ]
};

const recentItems = [
  {
    id: '1',
    name: 'The Culinary Code',
    author: 'Marco Rossi',
    chapter: {
      id: '1',
      name: 'A Recipe for Murder'
    }
  },
  {
    id: '2',
    name: 'Haiku of a Broken Heart',
    author: 'Hanako Nakamura',
    chapter: {
      id: '5',
      name: 'Cherry Blossoms in the Rain'
    }
  },
  {
    id: '3',
    name: 'Data & Destiny',
    author: 'Anya Sharma',
    chapter: {
      id: '2',
      name: 'The Rain That Never Stops'
    }
  },
  {
    id: '4',
    name: 'The Shadow Runner',
    author: 'Jane Doe',
    chapter: {
      id: '1',
      name: 'The Stolen Amulet'
    }
  }
];

const chapterContent = {
  novel_id: '1',
  chapter_id: '1',
  author: 'Duy Quang',
  novel_name: 'Lolita', // Replace with actual novel name from novels
  chapter_name: 'Part 1: The Lolita Haze', // More descriptive chapter title
  chapter_index: 1,
  total_chapter: 10,
  previous_chapter: null,
  next_chapter: {
    id: '2',
    name: 'Part 2'
  },
  content:
    "Humbert Humbert paced the worn carpet, a clammy sweat clinging to his brow. The heat shimmered off the asphalt outside, blurring the already distorted image of Dolores Haze skipping rope on the cracked sidewalk. Her red sundress billowed with each jump, revealing a glimpse of creamy skin beneath. A shiver, both thrilling and repulsive, ran down his spine. 'Isn't she lovely, Humbert?' cooed his landlady, Charlotte, her voice laced with a knowing smirk. Humbert forced a smile, the image of Lolita's innocent laughter a cruel counterpoint to the darkness churning within him." // Specific details, emotional tone, character interaction
};

export const handlers = [
  http.get(`${NOVEL_SERVICE_URL}/novels`, ({}) => {
    delay(200);
    return HttpResponse.json(novels, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/1/detail`, ({}) => {
    delay(200);
    return HttpResponse.json(novelDetail, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/recent/1`, ({}) => {
    delay(200);
    return HttpResponse.json(recentItems, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/detail/1/1`, ({}) => {
    delay(200);
    return HttpResponse.json(chapterContent, {
      status: 200
    });
  })
];

export const server = setupWorker(...handlers);
