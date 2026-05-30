export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export const getTimeOfDay = (date = new Date()): TimeOfDay => {
  const h = date.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

export const timeGreeting = (tod: TimeOfDay): string => {
  if (tod === 'morning') return 'Good Morning! 🌞 Start your day with a happy bite.';
  if (tod === 'afternoon') return 'Good Afternoon! 🌤 Fuel your mood with smart food choices.';
  return 'Good Evening! 🌙 Reflect and relax with your favorite meals.';
};

export const gradientForTime = (tod: TimeOfDay): string => {
  switch (tod) {
    case 'morning':
      return 'from-yellow-50 via-orange-50 to-pink-100';
    case 'afternoon':
      return 'from-blue-50 via-indigo-50 to-cyan-100';
    case 'evening':
    default:
      return 'from-purple-50 via-blue-50 to-indigo-100';
  }
};