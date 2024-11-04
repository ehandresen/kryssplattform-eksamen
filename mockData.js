export const mockData = [
  {
    id: 'artwork1',
    title: 'Sunset Serenity',
    artistId: 'artist1',
    photoURL: 'https://example.com/images/sunset-serenity.jpg',
    caption: 'A peaceful sunset over the mountains.',
    description:
      'This artwork captures the serene beauty of a sunset behind towering peaks, reflecting warm hues of orange and pink.',
    createdDate: '2024-10-01',
    category: 'Landscape',
    viewsCount: 134,
    likesCount: 45,
    comments: [
      {
        id: 'comment1',
        userId: 'user1',
        content: 'Stunning work! The colors are incredible.',
        timestamp: '2024-10-02T12:34:56Z',
      },
    ],
  },
  {
    id: 'artwork2',
    title: 'Abstract Thoughts',
    artistId: 'artist2',
    photoURL: 'https://example.com/images/abstract-thoughts.jpg',
    caption: 'An exploration of abstract shapes and colors.',
    description:
      'A complex interplay of colors and shapes, inviting viewers to interpret the piece in their own unique way.',
    createdDate: '2024-09-15',
    category: 'Abstract',
    viewsCount: 89,
    likesCount: 30,
    comments: [
      {
        id: 'comment2',
        userId: 'user2',
        content: 'I love how it sparks the imagination!',
        timestamp: '2024-09-17T08:22:10Z',
      },
    ],
  },
  {
    id: 'artwork3',
    title: 'Ocean Breeze',
    artistId: 'artist3',
    photoURL: 'https://example.com/images/ocean-breeze.jpg',
    caption: 'Feel the refreshing breeze of the ocean.',
    description:
      'A calming piece that brings the viewer closer to the sea with cool tones and a gentle flow.',
    createdDate: '2024-11-01',
    category: 'Seascape',
    viewsCount: 112,
    likesCount: 50,
    comments: [
      {
        id: 'comment3',
        userId: 'user3',
        content: 'Makes me want to visit the beach!',
        timestamp: '2024-11-03T15:18:45Z',
      },
    ],
  },
];
