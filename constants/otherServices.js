/**
 * @typedef {Object} OtherService
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} price
 * @property {import('react-native').ImageSourcePropType} image
 * @property {string[]} gradient
 */
/**
 * @typedef {Object} OtherServiceArtist
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

/** @type {OtherService[]} */
export const otherServices = [
  {
    id: 'live-youtube',
    title: 'Live on youtube.',
    description: 'Broadcast your event live with the team.',
    price: 11000,
    image: require('../assets/other_services/other1.jpg'),
    gradient: ['rgba(90,12,12,0.65)', 'rgba(90,12,12,0.35)'],
  },
  {
    id: 'light-sound-tent',
    title: 'Light, sound and tent crew.',
    description: 'Get acharayas along with sangeet team.',
    price: 11000,
    image: require('../assets/other_services/other2.png'),
    gradient: ['rgba(220,140,50,0.6)', 'rgba(220,140,50,0.3)'],
  },
  {
    id: 'decorators-stage-dhanush',
    title: 'Decorators, stage and dhanush.',
    description: 'Get 5 acharayas with high experience.',
    price: 21000,
    image: require('../assets/other_services/other3.jpg'),
    gradient: ['rgba(30,80,70,0.65)', 'rgba(30,80,70,0.35)'],
  },
];

/** @type {OtherServiceArtist[]} */
export const otherServiceArtists = [
  {
    id: 'artist-1',
    name: 'Suresh and camera crew',
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
    price: 55000,
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
    price: 55000,
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
    price: 55000,
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
    price: 55000,
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
    price: 55000,
    distance: '2 km away',
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
  },
];

export const otherServiceReview = {
  name: 'User 12345',
  date: 'Jan 16, 2026',
  rating: 4.9,
  text: 'The event was awesome and I really enjoyed the event with my family and friends. Amazing artist I must recommend you to experience Ramleela event.',
};

export const otherServiceAddresses = [
  { id: 'home', label: 'Home - 303B, 3rd floor', full: 'Home - 303B, 3rd floor, Vikaspuri 110037, New delhi' },
  { id: 'work', label: 'Work - 619A, 10', full: 'Work - 619A, 10th floor, New delhi' },
];

export const otherServiceCalendar = {
  monthLabel: 'January 2026',
  days: Array.from({ length: 31 }, (_, idx) => idx + 1),
  highlightedDay: 15,
};

export const otherServiceTimeSlots = ['8:00 AM', '9:00 AM', '6:00 PM', '10:00 PM', '11:00 PM', '12:00 PM'];

export const getServiceById = (id) => otherServices.find((s) => s.id === id) ?? otherServices[0];

export const getArtistById = (id) => otherServiceArtists.find((a) => a.id === id) ?? otherServiceArtists[0];
