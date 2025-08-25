import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, LayoutChangeEvent } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useBookById } from '@/hooks/useBooks';
import AsyncStorage from "@react-native-async-storage/async-storage"


const FONT_SIZE = 16;
const LINE_HEIGHT = 24;
const CHUNK_SIZE = 3000;

const BookScreen = () => {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const id = Array.isArray(bookId) ? bookId[0] : bookId;
  const { data, isLoading, error } = useBookById(id!);
  const flatListRef = useRef<FlatList>(null);
  const [isScrollingToPosition, setIsScrollingToPosition] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false)

  const HandleOnLayout = async () => {
    console.log("ilk yükleme")
  }
  const loadScrollPosition = async (w: number, h: number) => {
    console.log("tetiklendi-------------")
    if (isScrolled) { return null }
    try {
      const savedScrollY = await AsyncStorage.getItem(bookId);
      if (savedScrollY) {
        const scrollY = Number(savedScrollY);

        if (flatListRef.current && scrollY > 0) {

          flatListRef.current.scrollToOffset({
            offset: scrollY,
            animated: true,
          });

          console.log("save bulundu ve yüklendi", scrollY)
          if (h > scrollY) {
            setIsScrolled(true)
            setIsScrollingToPosition(false);
          }
        }
      } else {
        console.log("save yok")
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

  const HandleScroll = async (event: any) => {
    if (!isScrolled) { return "sa" }
    const currentScrollY = event.nativeEvent.contentOffset.y;

    //await AsyncStorage.setItem(bookId, currentScrollY.toString());
    await AsyncStorage.setItem(bookId, "70000");
    console.log("kaydedildi ", currentScrollY)
  }
  StatusBar.setHidden(true);

  if (isLoading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (error) return <Text>Hata: {error.message}</Text>;
  if (!data) return <Text>Veri bulunamadı</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}

        style={{ flex: 1, opacity: isScrollingToPosition ? 0.2 : 1 }}
        data={parts}
        scrollEventThrottle={10}
        onMomentumScrollEnd={(event) => { HandleScroll(event) }}

        showsVerticalScrollIndicator={true}
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