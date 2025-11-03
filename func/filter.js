// func/filter.js

export const filterProducts = (products, category, tab) => {
  let filtered = [...products];

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (tab !== 'all') {
    filtered = filtered.filter(p => p.tab === tab);
  }

  return filtered;
};