// utils/functions/filter.js

export const applyFilter = (data, filter) => {
  return data.filter((artwork) =>
    filter ? artwork.category === filter : true
  );
};

export const clearFilter = (data) => {
  return data; // Simply return all data without any filtering
};
