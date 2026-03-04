export const rudraServiceName = 'Rudrabhishek';

export const rudraPackages = [
  {
    id: 'sangeet',
    title: 'Sangeet package.',
    description: 'Get acharayas along with sangeet team.',
    price: 11000,
    gradient: ['#D7DDE8', '#BCC5CE', '#E8ECEF'],
  },
  {
    id: 'vedic',
    title: 'Vedic package.',
    description: 'Get 5 acharayas with high experience.',
    price: 21000,
    gradient: ['#F3D069', '#E2B55B', '#F6E2AC'],
  },
];

export const rudraArtists = [
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
];

export const rudraReview = {
  name: 'User 12345',
  date: 'Jan 16, 2026',
  rating: 4.9,
  text: 'The event was awesome and I really enjoyed the event with my family and friends. Amazing artist I must recommend you to experience Rudrabhishek event.',
};

export const rudraAddresses = [
  { id: 'home', label: 'Home - 303B, 3rd floor', full: 'Home - 303B, 3rd floor, Vikasapuri 110037, New delhi' },
  { id: 'work', label: 'Work - 619A, 10th floor', full: 'Work - 619A, 10th floor, New delhi' },
];

export const rudraCalendar = {
  monthLabel: 'Januari 2026',
  days: Array.from({ length: 31 }, (_, idx) => idx + 1),
  highlightedDay: 15,
};

export const rudraTimeSlots = ['8:00 AM', '9:00 AM', '6:00 PM', '10:00 PM', '11:00 PM', '12:00 PM'];

export const rudraFees = {
  base: 550,
  total: 11000,
};
