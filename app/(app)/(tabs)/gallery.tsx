import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Keyboard, TextInput } from 'react-native';
import UploadForm from '../../../components/gallery/menu/upload/UploadForm';
import ArtworkList from '../../../components/gallery/ArtworkList';
import SearchBar from '../../../components/gallery/menu/search/SearchBar';
import MenuBtn from '../../../components/gallery/menu/MenuBtn';
import FilterList from '../../../components/gallery/menu/filter/FilterList';
import { getAllArtworks } from '@/api/artworkApi'; // Import the Firestore function
import { Artwork } from '@/types/artwork'; // Import the updated Artwork type

export default function GalleryScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Artwork[]>([]); // Initialize as empty array
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]); // State to store all fetched artworks
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Fetch data from Firestore on component mount
    const fetchArtworks = async () => {
      const artworks = await getAllArtworks();
      setAllArtworks(artworks);
      setFilteredData(artworks); // Set both filteredData and allArtworks initially
    };

    fetchArtworks();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        setIsSearchVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const openForm = () => setIsFormVisible(true);
  const closeForm = () => setIsFormVisible(false);

  const toggleSearch = () => {
    if (!isSearchVisible) {
      setIsSearchVisible(true);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setIsSearchVisible(false);
      Keyboard.dismiss();
    }
  };

  const toggleFilter = () => setIsFilterVisible(!isFilterVisible);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterData(query, selectedFilter);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterVisible(false);
    filterData(searchQuery, filter);
  };

  const filterData = (query: string, filter: string | null) => {
    const filtered = allArtworks.filter(
      (artwork) =>
        ((artwork.title || '').toLowerCase().includes(query.toLowerCase()) ||
          (artwork.artistId || '')
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          (artwork.description || '')
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (filter ? artwork.category === filter : true)
    );
    setFilteredData(filtered);
  };

  const sortData = (criteria: 'A-Z' | 'Date') => {
    const sorted = [...filteredData].sort((a, b) => {
      if (criteria === 'A-Z') {
        // Use a fallback value if title is missing
        const titleA = a.title || '';
        const titleB = b.title || '';
        return titleA.localeCompare(titleB);
      } else if (criteria === 'Date') {
        const dateA = new Date(a.createdDate || '').getTime();
        const dateB = new Date(b.createdDate || '').getTime();
        return dateB - dateA; // Sort by date in descending order
      }
      return 0;
    });
    setFilteredData(sorted);
  };

  const availableCategories = Array.from(
    new Set(
      allArtworks
        .map((artwork) => artwork.category)
        .filter((cat): cat is string => cat !== undefined)
    )
  );

  return (
    <View style={styles.container}>
      <ArtworkList data={filteredData} />
      <MenuBtn
        isVisible={!isKeyboardVisible}
        onUploadPress={openForm}
        onSearchPress={toggleSearch}
        onFilterPress={toggleFilter}
        onSortAZ={() => sortData('A-Z')}
        onSortDate={() => sortData('Date')}
        onClearAll={() => setFilteredData(allArtworks)}
      />
      {isSearchVisible && (
        <SearchBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          searchInputRef={searchInputRef}
        />
      )}
      <FilterList
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onSelect={handleFilterSelect}
        hashtags={availableCategories}
      />
      <UploadForm visible={isFormVisible} onClose={closeForm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
