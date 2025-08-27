import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useCategories, useCategoryById } from '@/hooks/useCategories';
import { Book } from '@/types';
import BookModal from '@/components/Book';

const CategoryBooks = () => {
    const { categoryId, categoryTitle } = useLocalSearchParams<{ categoryId: string, categoryTitle: string }>();
    const { data: books, isLoading, error } = useCategoryById(categoryId);
    console.log(books) 
    if (isLoading) return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }}></ActivityIndicator>;
    if (error) return <Text>Hata: {error.message}</Text>;
    return (
    <View style={{flex: 1,padding:0,marginTop:45}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }:{item:Book}) => (
          <BookModal
            book={item}
          />
        )}
      />
    </View>
  );
}

export default CategoryBooks

const styles = StyleSheet.create({})