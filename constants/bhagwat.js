/**
 * @typedef {Object} BhagwatArtist
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

export const bhagwatServiceName = 'Bahgwat katha';

/** @type {BhagwatArtist[]} */
export const bhagwatArtists = [
  {
    id: 'artist-1',
    name: 'Artist full name 1',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    price: 55000,
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
    price: 55000,
    distance: '0.5 km away',
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
    price: 55000,
    distance: '0.5 km away',
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
    price: 55000,
    distance: '0.5 km away',
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
    price: 55000,
    distance: '0.5 km away',
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
    price: 55000,
    distance: '0.5 km away',
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
    price: 55000,
    distance: '0.5 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
  },
];

export const bhagwatReview = {
  name: 'User 12345',
  date: 'Jan 16, 2026',
  rating: 4.9,
  text: 'The event was awesome and I really enjoyed the event with my family and friends. Amazing artist I must recommend you to experience Ramleela event.',
};

export const bhagwatAddresses = [
  { id: 'home', label: 'Home - 303B, 3rd floor', full: 'Home - 303B, 3rd floor, Vikasapuri 110037, New delhi' },
  { id: 'work', label: 'Work - 619A, 10th floor', full: 'Work - 619A, 10th floor, New delhi' },
];

export const bhagwatCalendar = {
  monthLabel: 'January 2026',
  days: Array.from({ length: 31 }, (_, idx) => idx + 1),
  highlightedDay: 15,
};

export const bhagwatTimeSlots = ['8:00 AM', '9:00 AM', '6:00 PM', '10:00 PM', '11:00 PM', '12:00 PM'];

export const bhagwatFees = {
  base: 550,
  total: 11000,
};
