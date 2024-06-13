import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import { delay } from '../utils/utils';
import sampleCode from './sampleCode';

const NOVEL_SERVICE_URL = 'http://localhost:3000/api/v1';
const novels = {
  current_page: 1,
  total_pages: 10,
  top_categories: ['fantasy', 'adventure', 'romance'],
  novels: [
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
  ]
};

const novelsPage2 = {
  current_page: 2,
  total_pages: 10,
  top_categories: ['fantasy', 'adventure', 'romance'],
  novels: [
    {
      id: '17',
      name: 'The Shadow Runner',
      author: 'Jane Doe',
      url: 'https://picsum.photos/800?random=1',
      categories: ['fantasy', 'adventure', 'young adult']
    },
    {
      id: '28',
      name: 'A Byte of Love',
      author: 'Li Wei',
      url: 'https://picsum.photos/800?random=2',
      categories: ['science fiction', 'romance', 'adult']
    },
    {
      id: '39',
      name: 'Chronicles of a Chess Master',
      author: 'Peter Ivanov',
      url: 'https://picsum.photos/800?random=3',
      categories: ['historical fiction', 'drama', 'adult']
    },
    {
      id: '49',
      name: 'Haiku of a Broken Heart',
      author: 'Hanako Nakamura',
      url: 'https://picsum.photos/800?random=4',
      categories: ['poetry', 'coming-of-age', 'young adult']
    },
    {
      id: '59',
      name: 'The Culinary Code',
      author: 'Marco Rossi',
      url: 'https://picsum.photos/800?random=5',
      categories: ['mystery', 'thriller', 'adult']
    },
    {
      id: '69',
      name: 'The Call of the Wild (retold)',
      author: 'Jack London (adapted by Sarah Johnson)',
      url: 'https://picsum.photos/800?random=6',
      categories: ['classics', 'adventure', 'all ages']
    },
    {
      id: '79',
      name: 'Data & Destiny',
      author: 'Anya Sharma',
      url: 'https://picsum.photos/800?random=7',
      categories: ['science fiction', 'dystopian', 'young adult']
    },
    {
      id: '89',
      name: "The Emperor's Decree",
      author: 'Wang Lin',
      url: 'https://picsum.photos/800?random=8',
      categories: ['historical fiction', 'political', 'adult']
    },
    {
      id: '99',
      name: 'The Shadow Runner',
      author: 'Jane Doe',
      url: 'https://picsum.photos/800?random=9',
      categories: ['fantasy', 'adventure', 'young adult']
    },
    {
      id: '109',
      name: 'A Byte of Love',
      author: 'Li Wei',
      url: 'https://picsum.photos/800?random=10',
      categories: ['science fiction', 'romance', 'adult']
    },
    {
      id: '119',
      name: 'Chronicles of a Chess Master',
      author: 'Peter Ivanov',
      url: 'https://picsum.photos/800?random=11',
      categories: ['historical fiction', 'drama', 'adult']
    },
    {
      id: '129',
      name: 'Haiku of a Broken Heart',
      author: 'Hanako Nakamura',
      url: 'https://picsum.photos/800?random=12',
      categories: ['poetry', 'coming-of-age', 'young adult']
    },
    {
      id: '139',
      name: 'The Culinary Code',
      author: 'Marco Rossi',
      url: 'https://picsum.photos/800?random=13',
      categories: ['mystery', 'thriller', 'adult']
    },
    {
      id: '149',
      name: 'The Call of the Wild (retold)',
      author: 'Jack London (adapted by Sarah Johnson)',
      url: 'https://picsum.photos/800?random=14',
      categories: ['classics', 'adventure', 'all ages']
    },
    {
      id: '159',
      name: 'Data & Destiny',
      author: 'Anya Sharma',
      url: 'https://picsum.photos/800?random=15',
      categories: ['science fiction', 'dystopian', 'young adult']
    },
    {
      id: '169',
      name: "The Emperor's Decree",
      author: 'Wang Lin',
      url: 'https://picsum.photos/800?random=16',
      categories: ['historical fiction', 'political', 'adult']
    }
  ]
};
const novelDetail = {
  name: 'The Indigo Spell',
  author: 'Isadora Moon',
  url: 'https://picsum.photos/800?random=1',
  categories: ['fantasy', 'magic', 'young adult'],
  description: 'A young witch discovers a hidden power that could change the fate of her kingdom.',
  supplier: 'truyenfull.vn',
  suppliers: ['truyenfull.vn', 'lightnovel.vn'],
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
      number: 1,
      name: 'A Recipe for Murder'
    }
  },
  {
    id: '2',
    name: 'Haiku of a Broken Heart',
    author: 'Hanako Nakamura',
    chapter: {
      id: '5',
      number: 5,
      name: 'Cherry Blossoms in the Rain'
    }
  },
  {
    id: '3',
    name: 'Data & Destiny',
    author: 'Anya Sharma',
    chapter: {
      id: '2',
      number: 2,
      name: 'The Rain That Never Stops'
    }
  },
  {
    id: '4',
    name: 'The Shadow Runner',
    author: 'Jane Doe',
    chapter: {
      id: '1',
      number: 1,
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
  supplier: 'truyenfull.vn',
  suppliers: ['truyenfull.vn', 'lightnovel.vn'],
  next_chapter: {
    id: '2',
    name: 'Part 2'
  },
  content:
    "Humbert Humbert paced the worn carpet, a clammy sweat clinging to his brow. The heat shimmered off the asphalt outside, blurring the already distorted image of Dolores Haze skipping rope on the cracked sidewalk. Her red sundress billowed with each jump, revealing a glimpse of creamy skin beneath. A shiver, both thrilling and repulsive, ran down his spine. 'Isn't she lovely, Humbert?' cooed his landlady, Charlotte, her voice laced with a knowing smirk. Humbert forced a smile, the image of Lolita's innocent laughter a cruel counterpoint to the darkness churning within him." // Specific details, emotional tone, character interaction
};

const userSignUpResponse = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjE5MDNhYTU4MmJhNGNhNmQxYTZlZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTc2Njk5NDYsImV4cCI6MTcxNzcwNTk0Nn0.MuCw-KOUpcHCGr8A8uKS4fHfnPA9Odm_-ekrMjM1uxI',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjE5MDNhYTU4MmJhNGNhNmQxYTZlZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTc2Njk5NDYsImV4cCI6MTcxODI3NDc0Nn0.ef_7QzmCiXBlalGeln7Qa4qXEFkJFl_IK0WweAWbz14',
  expiresIn: 36000,
  tokenType: 'Bearer',
  authorization: 'user'
};

const userLogInResponse = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjE5MDNhYTU4MmJhNGNhNmQxYTZlZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTc2Njk5NDYsImV4cCI6MTcxNzcwNTk0Nn0.MuCw-KOUpcHCGr8A8uKS4fHfnPA9Odm_-ekrMjM1uxI',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjE5MDNhYTU4MmJhNGNhNmQxYTZlZSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MTc2Njk5NDYsImV4cCI6MTcxODI3NDc0Nn0.ef_7QzmCiXBlalGeln7Qa4qXEFkJFl_IK0WweAWbz14',
  expiresIn: 36000,
  tokenType: 'Bearer',
  authorization: 'admin'
};

const suppliers = [
  {
    supplier: 'https://truyenfull.vn/',
    total_chapter: 0,
    total_novel: 0
  },
  {
    supplier: 'https://lightnovel.vn/',
    total_chapter: 0,
    total_novel: 0
  }
];

export const handlers = [
  http.get(`${NOVEL_SERVICE_URL}/novels`, ({ request }) => {
    delay(200);
    const url = new URL(request.url);
    const offset = url.searchParams.get('offset');
    if (!offset || offset == 0) {
      return HttpResponse.json(novels, {
        status: 200
      });
    }
    return HttpResponse.json(novelsPage2, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/novels/detail/1`, ({ request }) => {
    delay(200);
    const url = new URL(request.url);
    const domain = url.searchParams.get('domain_name');
    if (domain === 'lightnovel.vn') {
      const tempNovel = Object.assign({}, novelDetail);
      tempNovel.description = 'This is a sample description';
      tempNovel.supplier = 'lightnovel.vn';
      return HttpResponse.json(tempNovel, {
        status: 200
      });
    }
    return HttpResponse.json(novelDetail, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/u/recent`, ({}) => {
    delay(200);
    return HttpResponse.json(recentItems, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/admin/recent`, ({}) => {
    delay(200);
    return HttpResponse.json(recentItems, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/novels/detail/1/1`, ({}) => {
    delay(200);
    return HttpResponse.json(chapterContent, {
      status: 200
    });
  }),
  http.post(`${NOVEL_SERVICE_URL}/auth/signup`, ({}) => {
    delay(200);
    return HttpResponse.json(userSignUpResponse, {
      status: 200
    });
  }),
  http.post(`${NOVEL_SERVICE_URL}/auth/login`, ({}) => {
    delay(200);
    return HttpResponse.json(userLogInResponse, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/admin/plugins`, ({}) => {
    delay(200);
    return HttpResponse.json(suppliers, {
      status: 200
    });
  }),
  http.get(`${NOVEL_SERVICE_URL}/admin/plugins/truyenfull.vn`, async ({}) => {
    delay(200);
    return HttpResponse.json(sampleCode, {
      status: 200
    });
  }),
  http.post(`${NOVEL_SERVICE_URL}/admin/plugins/plug`, async ({}) => {
    delay(500);
    return HttpResponse.json([], {
      status: 200
    });
  })
];

export const server = setupWorker(...handlers);
