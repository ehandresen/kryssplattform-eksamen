/**
 * Filtrerer en liste med objekter basert på en søkestreng og en nøkkel (key).
 * Funksjonen sjekker om søkestrengen finnes i verdien til den spesifikke nøkkelen.
 *
 * @param {Array} data
 * @param {string} query
 * @param {string} key
 * @returns {Array}
 */
export function filterByKey(data, query, key) {
  if (!query) return data;

  const lowercasedQuery = query.toLowerCase();

  return data.filter((item) => {
    const value = item[key];
    if (typeof value === "string") {
      return value.toLowerCase().includes(lowercasedQuery);
    }
    return false;
  });
}

/**
 * Nullstiller filteret og returnerer den originale listen.
 *
 * @param {Array} data
 * @returns {Array}
 */
export function clearFilter(data) {
  return data;
}
