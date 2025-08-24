import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useBookById } from '@/hooks/useBooks';


const { width: screenWidth, height: screenHeight } = useWindowDimensions();

const FONT_SIZE = 16;
const LINE_HEIGHT = 24;
const LINE_PER_PAGE = (screenHeight-100)/(FONT_SIZE+LINE_HEIGHT + 5)

const BookScreen = () => { 
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const id = Array.isArray(bookId) ? bookId[0] : bookId; // string | string[] guard

  const { data, isLoading, error } = useBookById(id!);
  const text = "abcdaxsd ".repeat(300)

  if (isLoading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text>Hata: {error.message}</Text>;


  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, marginTop: 45, marginBottom: 55 }}>
        <Text style={styles.text}> {text} </Text>
      </View>
    </SafeAreaView>
  );
}

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {

    padding: 10,
  },
  text: {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
  },
})
