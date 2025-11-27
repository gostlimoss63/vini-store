// func/sort.js

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case "popular":
      // Sorteado por popularidade (rating * reviews)
      return sorted.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
    case "newest":
      // Em um aplicativo real, você classificaria por um campo de data. Aqui, simulamos com ID.
      return sorted.sort((a, b) => b.id - a.id);
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    default:
      return sorted;
  }
};
