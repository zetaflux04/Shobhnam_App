/**
 * Artists for Discover flow - shown on map with coordinates
 * Delhi area: ~28.6°N, 77.0°E (Vikaspuri, Nilothi, Hastsal, etc.)
 */

/** @type {Array<{id: string; name: string; experience: string; rating: number; reviews: number; languages: string[]; image: import('react-native').ImageSourcePropType; verified: boolean; latitude: number; longitude: number; about: string; gallery: import('react-native').ImageSourcePropType[]}>} */
export const discoverArtists = [
  {
    id: 'suresh',
    name: 'Suresh and camera crew',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    languages: ['English', 'Hindi', 'Nepali'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
    latitude: 28.6519,
    longitude: 77.0497,
    about:
      'On the Talkndheal platform, you can receive free services such as detailed birth chart analysis, Ashtakoota match, numerology, Panchang, daily update and more.',
    gallery: [
      require('../assets/service/artist 1.png'),
      require('../assets/service/artist 2.png'),
      require('../assets/service/artist 3.png'),
    ],
  },
  {
    id: 'artist-2',
    name: 'Ramnath dubey',
    experience: '10 Years',
    rating: 4.9,
    reviews: 600,
    languages: ['English', 'Hindi'],
    image: require('../assets/service/artist 2.png'),
    verified: true,
    latitude: 28.648,
    longitude: 77.042,
    about:
      'On the Talkndheal platform, you can receive free services such as detailed birth chart analysis, Ashtakoota match, numerology, Panchang, daily update and more.',
    gallery: [
      require('../assets/service/artist 2.png'),
      require('../assets/service/artist 1.png'),
      require('../assets/service/artist 3.png'),
    ],
  },
  {
    id: 'artist-3',
    name: 'Artist full name 3',
    experience: '8 Years',
    rating: 4.8,
    reviews: 420,
    languages: ['Hindi', 'Nepali'],
    image: require('../assets/service/artist 3.png'),
    verified: false,
    latitude: 28.655,
    longitude: 77.055,
    about:
      'On the Talkndheal platform, you can receive free services such as detailed birth chart analysis, Ashtakoota match, numerology, Panchang, daily update and more.',
    gallery: [
      require('../assets/service/artist 3.png'),
      require('../assets/service/artist 1.png'),
      require('../assets/service/artist 2.png'),
    ],
  },
  {
    id: 'artist-4',
    name: 'Artist full name 4',
    experience: '12 Years',
    rating: 4.95,
    reviews: 800,
    languages: ['English', 'Hindi', 'Sanskrit'],
    image: require('../assets/service/artist 1.png'),
    verified: true,
    latitude: 28.644,
    longitude: 77.038,
    about:
      'On the Talkndheal platform, you can receive free services such as detailed birth chart analysis, Ashtakoota match, numerology, Panchang, daily update and more.',
    gallery: [
      require('../assets/service/artist 1.png'),
      require('../assets/service/artist 2.png'),
      require('../assets/service/artist 3.png'),
    ],
  },
  {
    id: 'artist-5',
    name: 'Artist full name 5',
    experience: '6 Years',
    rating: 4.7,
    reviews: 280,
    languages: ['Hindi'],
    image: require('../assets/service/artist 2.png'),
    verified: false,
    latitude: 28.658,
    longitude: 77.048,
    about:
      'On the Talkndheal platform, you can receive free services such as detailed birth chart analysis, Ashtakoota match, numerology, Panchang, daily update and more.',
    gallery: [
      require('../assets/service/artist 2.png'),
      require('../assets/service/artist 3.png'),
      require('../assets/service/artist 1.png'),
    ],
  },
];

export const discoverReview = {
  name: 'User 12345',
  date: 'Jan 16, 2026',
  rating: 4.9,
  text: 'The event was awesome and i really enjoyed the event with my family and friends. Amazing artist i must recoment you to experience Ramleela event.',
};
