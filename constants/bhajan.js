export const bhajanServiceName = 'Bhajan sandhya';

export const bhajanPackages = [
  {
    id: 'diamond',
    title: 'Diamond package.',
    description: 'The most immersive Bhajan sandhya experience best artists.',
    price: 11000,
    gradient: ['#C0A9F5', '#7CA8FF', '#EED487'],
  },
  {
    id: 'platinum',
    title: 'Platinum package.',
    description: 'A rich Bhajan sandhya experience with skilled artists.',
    price: 8100,
    gradient: ['#8EE0DE', '#9DE3F1', '#DFF3F8'],
  },
  {
    id: 'gold',
    title: 'Gold package.',
    description: 'A meaningful traditional Bhajan sandhya experience.',
    price: 5100,
    gradient: ['#F3D069', '#E2B55B', '#F6E2AC'],
  },
  {
    id: 'silver',
    title: 'Silver package.',
    description: 'A simple and short Bhajan sandhya experience.',
    price: 3100,
    gradient: ['#E8E8E8', '#D4D9E1', '#A7B1BD'],
  },
];

export const bhajanArtists = [
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
];

export const bhajanReview = {
  name: 'User 12345',
  date: 'Jan 16, 2026',
  rating: 4.9,
  text: 'The event was awesome and I really enjoyed the event with my family and friends. Amazing artist I must recommend you to experience Bhajan sandhya event.',
};

export const bhajanAddresses = [
  { id: 'home', label: 'Home - 303B, 3rd floor', full: 'Home - 303B, 3rd floor, Vikasapuri 110037, New delhi' },
  { id: 'work', label: 'Work - 619A, 10th floor', full: 'Work - 619A, 10th floor, New delhi' },
];

export const bhajanCalendar = {
  monthLabel: 'Januari 2026',
  days: Array.from({ length: 31 }, (_, idx) => idx + 1),
  highlightedDay: 15,
};

export const bhajanTimeSlots = ['8:00 AM', '9:00 AM', '6:00 PM', '10:00 PM', '11:00 PM', '12:00 PM'];

export const bhajanFees = {
  base: 550,
  total: 11000,
};
