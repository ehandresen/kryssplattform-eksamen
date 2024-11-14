// utils/functions/sort.js

export const sortAZ = (data) => {
  return [...data].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
};

export const sortDate = (data) => {
  return [...data].sort(
    (a, b) =>
      new Date(b.createdDate || "").getTime() -
      new Date(a.createdDate || "").getTime()
  );
};
