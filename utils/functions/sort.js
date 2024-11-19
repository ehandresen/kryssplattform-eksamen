// utils/functions/sort.js
export const sortByKey = (data, key, order = "asc") => {
  return [...data].sort((a, b) => {
    const aValue = (a[key] || "").toString().toLowerCase();
    const bValue = (b[key] || "").toString().toLowerCase();

    if (order === "desc") {
      return bValue.localeCompare(aValue);
    }
    return aValue.localeCompare(bValue);
  });
};

export const sortTitleAZ = (data) => sortByKey(data, "title", "asc");
export const sortTitleZA = (data) => sortByKey(data, "title", "desc");
export const sortNameAZ = (data) => sortByKey(data, "displayName", "asc");
export const sortNameZA = (data) => sortByKey(data, "displayName", "desc");
