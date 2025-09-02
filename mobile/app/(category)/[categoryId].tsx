import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useCategoryById } from '@/hooks/useCategories';
import { Book } from '@/types';
import BookModal from '@/components/Book';
import LoadingComponent from '@/components/LoadingComponent';
import useTheme from '@/hooks/useTheme';

const CategoryBooks = () => {
    const { categoryId, categoryTitle } = useLocalSearchParams<{ categoryId: string, categoryTitle: string }>();
    const { data: books, isLoading, error } = useCategoryById(categoryId);
    const {colors} = useTheme()
    if (isLoading) return <LoadingComponent/>;
    if (error) return <Text>Hata: {error.message}</Text>;
    return (
    <View style={{flex: 1,paddingTop:45,backgroundColor:colors.bg}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }:{item:Book}) => (
          <BookModal
            book={item}
            colors={colors}
          />
        )}
      />
    </View>
  );
}

export default CategoryBooks

const styles = StyleSheet.create({})