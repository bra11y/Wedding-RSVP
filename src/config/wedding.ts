/* ═════════════ EDIT THE WEDDING DETAILS HERE ═════════════
   Every section of the page reads from this file. */

export const wedding = {
  partners: ['Ruchee', 'Wenekanma'] as const,
  monogram: 'R & W',
  start: '2027-03-20T14:00:00+01:00',
  end: '2027-03-20T22:00:00+01:00',
  dateLabel: 'Saturday · 20 March 2027',
  shortDate: '20 · 03 · 2027',
  rsvpBy: '20 February 2027',

  venue: {
    name: 'Venue Name',
    address: 'Street address · City',
    hours: '2:00 PM – 10:00 PM',
    full: 'Venue Name, Street address, City',
    mapsUrl: 'https://maps.google.com/?q=Lagos',
  },

  schedule: [
    { time: '1:30 PM', title: 'Guest Arrival', text: 'Light refreshments and time to find your seat', icon: 'M15 3h4v18h-4M10 17l5-5-5-5M15 12H3' },
    { time: '2:00 PM', title: 'Ceremony', text: 'We say "I do" surrounded by those we love', icon: 'M4 14a5 5 0 1010 0 5 5 0 10-10 0M10 14a5 5 0 1010 0 5 5 0 10-10 0M12 4l2 3h-4z' },
    { time: '3:30 PM', title: 'Cocktail Hour', text: 'Drinks, small bites and a little mingling', icon: 'M8 3h8l-1 7a3 3 0 01-6 0zM12 13v7M8 20h8' },
    { time: '5:00 PM', title: 'Dinner & Toasts', text: 'A shared meal followed by a few words from loved ones', icon: 'M5 3v8a2 2 0 002 2v8M9 3v8M7 3v8M17 3c-2 2-2 7 0 9v9' },
    { time: '8:00 PM', title: 'First Dance & Open Floor', text: 'Join us for music, dancing and dessert', icon: 'M9 18V6l10-2v12M9 18a3 3 0 11-3-3 3 3 0 013 3zM19 16a3 3 0 11-3-3 3 3 0 013 3z' },
    { time: '9:30 PM', title: 'Sparkler Send-Off', text: 'One last photo and a warm goodnight', icon: 'M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3' },
  ],

  dressCode: {
    summary: 'Elegant and comfortable',
    text: 'Formal attire in natural and warm tones is encouraged.',
    colours: [
      { name: 'Forest', hex: '#2f4a3c' },
      { name: 'Sage', hex: '#79b08f' },
      { name: 'Butter', hex: '#e7cf8c' },
      { name: 'Red', hex: '#b9332f' },
    ],
  },

  hotels: [
    { name: 'Hotel name', text: 'A short drive from the venue, with breakfast included.', address: 'Street address · City', mapsUrl: 'https://maps.google.com' },
    { name: 'Second hotel name', text: 'Quiet, comfortable rooms close to the celebration.', address: 'Street address · City', mapsUrl: 'https://maps.google.com' },
  ],

  bank: [
    { label: 'Account holder', value: 'Ruchee & Wenekanma' },
    { label: 'Bank', value: 'Bank name' },
    { label: 'Account number', value: '0000000000' },
    { label: 'Reference', value: 'Wedding Gift' },
  ],

  giftIdeas: [
    'A handwritten note or favourite date-night recommendation for our keepsake box.',
    'A contribution toward our honeymoon.',
  ],

  faqs: [
    { q: 'Can I bring a plus one?', a: "Your invitation will show the names of everyone invited. If you're unsure, just ask us." },
    { q: 'Is parking available?', a: 'Yes, there is parking at the venue.' },
    { q: 'Are children welcome?', a: 'Add your answer here.' },
    { q: 'What time should I arrive?', a: 'Please arrive by 1:30 PM so we can begin the ceremony on time.' },
  ],

  note: "We feel so lucky to have you in our lives. Thank you for the love, the prayers and the laughter that brought us here. We can't wait to celebrate this day with you.",
};
