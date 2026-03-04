/**
 * @typedef {Object} SunderPackage
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {string[]} gradient
 */
/**
 * @typedef {Object} SunderArtist
 * @property {string} id
 * @property {string} name
 * @property {string} experience
 * @property {number} rating
 * @property {number} reviews
 * @property {number} price
 * @property {string} distance
 * @property {string[]} languages
 * @property {import('react-native').ImageSourcePropType} image
 * @property {boolean} [verified]
 */

export const sunderServiceName = 'Sunderkand';

/** @type {SunderPackage[]} */
export const sunderPackages = [
  {
    id: 'diamond',
    title: 'Diamond package.',
    description: 'The most immersive Sunderkand experience with best artists.',
    price: 11000,
    gradient: ['#C0A9F5', '#7CA8FF', '#EED487'],
  },
  {
    id: 'platinum',
    title: 'Platinum package.',
    description: 'A rich Sunderkand experience with skilled artists.',
    price: 8100,
    gradient: ['#8EE0DE', '#9DE3F1', '#DFF3F8'],
  },
  {
    id: 'gold',
    title: 'Gold package.',
    description: 'A meaningful traditional Sunderkand experience.',
    price: 5100,
    gradient: ['#F3D069', '#E2B55B', '#F6E2AC'],
  },
  {
    id: 'silver',
    title: 'Silver package.',
    description: 'A simple and short Sunderkand experience.',
    price: 3100,
    gradient: ['#E8E8E8', '#D4D9E1', '#A7B1BD'],
  },
];

/** @type {SunderArtist[]} */
export const sunderArtists = [
  {
    id: 'artist-1',
    name: 'Artist full name 1',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '0.5 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
  },
  {
    id: 'artist-2',
    name: 'Artist full name 2',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '0.7 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 2.png'),
    verified: true,
  },
  {
    id: 'artist-3',
    name: 'Artist full name 3',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '0.8 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 3.png'),
    verified: true,
  },
  {
    id: 'artist-4',
    name: 'Artist full name 4',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '1 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
  },
  {
    id: 'artist-5',
    name: 'Artist full name 5',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '2 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 2.png'),
    verified: true,
  },
  {
    id: 'artist-6',
    name: 'Artist full name 6',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '2 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 3.png'),
    verified: true,
  },
  {
    id: 'artist-7',
    name: 'Artist full name 7',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 550,
    distance: '2 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
  },
];

export const sunderReview = {
  name: 'User 12345',
  date: 'Jan 16, 2026',
  rating: 4.9,
  text: 'The event was awesome and I really enjoyed the event with my family and friends. Amazing artist I must recommend you to experience Sunderkand event.',
};

export const sunderAddresses = [
  { id: 'home', label: 'Home - 303B, 3rd floor', full: 'Home - 303B, 3rd floor, Vikasapuri 110037, New delhi' },
  { id: 'work', label: 'Work - 619A, 10th floor', full: 'Work - 619A, 10th floor, New delhi' },
];

export const sunderCalendar = {
  monthLabel: 'Januari 2026',
  days: Array.from({ length: 31 }, (_, idx) => idx + 1),
  highlightedDay: 15,
};

export const sunderTimeSlots = ['8:00 AM', '9:00 AM', '6:00 PM', '10:00 PM', '11:00 PM', '12:00 PM'];

export const sunderFees = {
  base: 550,
  total: 11000,
};
