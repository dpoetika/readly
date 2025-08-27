import { SafeAreaView, StatusBar, StyleSheet, Text, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useBookById } from '@/hooks/useBooks';
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoadingComponent from '@/components/LoadingComponent';


const FONT_SIZE = 16;
const LINE_HEIGHT = 24;
const CHUNK_SIZE = 3000;

const BookScreen = () => {
  const { bookId,bookName,bookAuthor} = useLocalSearchParams<{ bookId: string,bookName:string,bookAuthor:string}>();
  const id = Array.isArray(bookId) ? bookId[0] : bookId;
  const { data, isLoading, error } = useBookById(id!);
  const flatListRef = useRef<FlatList>(null);
  const [isScrollingToPosition, setIsScrollingToPosition] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastSave, setLastSave] = useState("")
  const loadScrollPosition = async (w: number, h: number) => {
    if (isScrolled) { return null }
    const getItem = await AsyncStorage.getItem("recentlyRead");
    if (getItem===null){
      setIsScrolled(true) 
      setIsScrollingToPosition(false);
      return
    }
    setLastSave(getItem)
    try {

      const currentBook = JSON.parse(getItem)[bookId];
      if (currentBook) {
        const savedScrollY = currentBook.page;
        const scrollY = Number(savedScrollY);

        if (flatListRef.current && scrollY > 0) {

          flatListRef.current.scrollToOffset({
            offset: scrollY,
            animated: true,
          });

          if (h > scrollY) {
            setIsScrolled(true)
            setIsScrollingToPosition(false);
          }
        }
      } else {
        setIsScrolled(true)
        setIsScrollingToPosition(false);
      }
    } catch (error) {
      console.error('Scroll position load error:', error);
    }
  };

  const splitText = (text: string, size: number): string[] => {
    let chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  };
  const parts = useMemo(() => {
    if (!data?.data) return [];
    return splitText(data.data, CHUNK_SIZE);
  }, [data?.data]);

  const HandleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolled) { return null }
    const currentScrollY:Number = event.nativeEvent.contentOffset.y;
    
    let recentlyRead = lastSave ? JSON.parse(lastSave) : {};
    
    recentlyRead[bookId] = {
      id: bookId,
      page: currentScrollY,
      author: bookAuthor,
      title: bookName,
      img:`https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.cover.medium.jpg`,
    };
    await AsyncStorage.setItem("recentlyRead", JSON.stringify(recentlyRead));
  }
  StatusBar.setHidden(true);

  if (isLoading) return <LoadingComponent/>;
  if (error) return <Text>Hata: {error.message}</Text>;
  if (!data) return <Text>Veri bulunamadı</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={{ flex: 1, opacity: isScrollingToPosition ? 0.2 : 1 }}
        data={parts}
        scrollEventThrottle={10}
        onMomentumScrollEnd={(event:NativeSyntheticEvent<NativeScrollEvent>) => { HandleScroll(event) }}

        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}

        //onLayout={(event)=>loadScrollPosition(event)}
        onContentSizeChange={(w, h) => loadScrollPosition(w, h)}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item}
          </Text>
        )}
      />
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
  text: {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    padding: 10,
  },
});