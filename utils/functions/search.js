/**
 * Filtrerer en liste med objekter basert på en søkestreng og en nøkkel (key).
 * Funksjonen sjekker om søkestrengen finnes i verdien til den spesifikke nøkkelen.
 *
 * @param {Array} data - Listen med data som skal filtreres (kan være hvilken som helst datatype).
 * @param {string} query - Søkestrengen som brukes for filtrering.
 * @param {string} key - Nøkkelen i objektene som vi skal søke i.
 * @returns {Array} - Den filtrerte listen.
 */
export function searchByKey(data, query, key) {
  if (!query) return data; // Hvis søkestrengen er tom, returneres original data.

  const lowercasedQuery = query.toLowerCase(); // Gjør søkestrengen til små bokstaver for case-insensitiv søk.

  return data.filter((item) => {
    const value = item[key]; // Hent verdien til den spesifikke nøkkelen
    if (typeof value === "string") {
      return value.toLowerCase().includes(lowercasedQuery); // Sjekk om verdien inneholder søkestrengen.
    }
    return false; // Hvis verdien ikke er en streng, filtreres det ut.
  });
}
