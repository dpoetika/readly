import MyLibraryBook from "@/components/MyLibraryBook";
import { Book } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, FlatList, ActivityIndicator, View, RefreshControl, ScrollView } from "react-native";

export default function Index() {

  const [recentlyBooks, setRecentlyBooks] = useState<Book[]>([])
  const [isLoadingRecently, setIsLoadingRecently] = useState(true)

  const [favBooks, setFavBooks] = useState<Book[]>([])
  const [isLoadingFav, setIsLoadingFav] = useState(true)

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllBooks();
    await getAllFavs()
    setRefreshing(false);
  };
  
  const getAllBooks = async () => {
    try {
      const recentlyRead = await AsyncStorage.getItem("recentlyRead");

      if (!recentlyRead) {
        setRecentlyBooks([]); // Boş dizi olarak ayarla
        setIsLoadingRecently(false);
        return;
      }

      const parsedData = JSON.parse(recentlyRead);
      const allItems = Object.values(parsedData);

      const booksData = allItems
        .map((item: any) => {
          try {
            return {
              id: item.id,
              img: `https://www.gutenberg.org/cache/epub/${item.id}/pg${item.id}.cover.medium.jpg`,
              title: item.title,
              author: item.author,
              page: item.page
            };
          } catch (error) {
            console.error('Parse hatası:', error, item);
            return null;
          }
        })
        .filter((item) => item !== null);

      setRecentlyBooks(booksData);
      setIsLoadingRecently(false);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setRecentlyBooks([]); // Hata durumunda boş dizi olarak ayarla
      setIsLoadingRecently(false);
    }
  };
  
  const getAllFavs = async () => {
    try {
      const favBooks = await AsyncStorage.getItem("favs");

      if (!favBooks) {
        setFavBooks([]); // Boş dizi olarak ayarla
        setIsLoadingFav(false);
        return;
      }

      const parsedData = JSON.parse(favBooks);
      const allItems = Object.values(parsedData);

      const booksData = allItems
        .map((item: any) => {
          try {
            return {
              id: item.id,
              img: `https://www.gutenberg.org/cache/epub/${item.id}/pg${item.id}.cover.medium.jpg`,
              title: item.title,
              author: item.author,
              page: item.page
            };
          } catch (error) {
            console.error('Parse hatası:', error, item);
            return null;
          }
        })
        .filter((item) => item !== null);

      setFavBooks(booksData);
      setIsLoadingFav(false);
      console.log(booksData)
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setFavBooks([]); // Hata durumunda boş dizi olarak ayarla
      setIsLoadingFav(false);
    }
  };

  useEffect(() => {
    getAllBooks()
    getAllFavs()
  }, [])

  if (isLoadingRecently || isLoadingFav) return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }}></ActivityIndicator>;

  return (
    <View style={{ padding: 0, marginTop: 45, flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {recentlyBooks.length > 0 ? (
          <>
            <Text style={{ fontSize: 30, fontWeight: 900, alignSelf: "center" }}>Okumaya Devam Edin</Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={recentlyBooks} // Object.values kullanmaya gerek yok
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }: { item: any }) => (
                <MyLibraryBook
                  book={item}
                />
              )}
            />
          </>
        ) : (
          <></>
        )}

        {favBooks.length > 0 ? (
          <>
            <Text style={{ fontSize: 30, fontWeight: 900, alignSelf: "center" }}>Favorileriniz</Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={favBooks} // Object.values kullanmaya gerek yok
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }: { item: any }) => (
                <MyLibraryBook
                  book={item}
                />
              )}
            />
          </>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
}