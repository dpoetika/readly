import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchComponent from '@/components/SearchComponent'
import BookModal from '@/components/Book'
import { Book } from '@/types'
import { useSearchBooks } from '@/hooks/useBooks'

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('')
  const { data: foundBooks, isLoading, error, refetch } = useSearchBooks(searchText);
  const [books, setBooks] = useState<Book[]>([])
  const handleSearch = () => {
    
    if (searchText.trim()) {
      console.log("tıklandı")
      refetch()
    }
  }
  useEffect(() => {
    if (foundBooks) {
      console.log("çalıştı")
      setBooks(foundBooks);
    }
  }, [foundBooks]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <SearchComponent
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        placeholder="Search Books or Author..."
        buttonText="Ara"
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Book }) => (
          <BookModal
            book={item}
          />
        )}
      />
    </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})