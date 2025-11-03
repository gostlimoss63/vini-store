// func/sort.js

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'popular':
      // Sort by rating, then by number of reviews
      return sorted.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
    case 'newest':
      // In a real app, you'd sort by a date field. Here, we'll simulate with ID.
      return sorted.sort((a, b) => b.id - a.id);
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    default:
      return sorted;
  }
};