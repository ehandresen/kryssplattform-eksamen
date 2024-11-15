/**
 * Filters artworks based on a search query.
 * @param {Array} artworks - The list of artworks to filter.
 * @param {string} query - The search query to filter by.
 * @returns {Array} - The filtered list of artworks.
 */
export function filterArtworksByQuery(artworks, query) {
  if (!query) return artworks;

  const lowercasedQuery = query.toLowerCase();

  return artworks.filter(
    (artwork) =>
      (artwork.title &&
        artwork.title.toLowerCase().includes(lowercasedQuery)) ||
      (artwork.artist &&
        artwork.artist.toLowerCase().includes(lowercasedQuery)) ||
      (artwork.description &&
        artwork.description.toLowerCase().includes(lowercasedQuery))
  );
}
