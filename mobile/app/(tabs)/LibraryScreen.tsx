import MyLibraryBook from "@/components/MyLibraryBook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, FlatList, ActivityIndicator, View } from "react-native";

export default function Index() {

  const [books, setBooks] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const getAllBooks = async () => {
  try {
    const recentlyRead = await AsyncStorage.getItem("recentlyRead");

    if (!recentlyRead) {
      setIsLoading(false);
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

    setBooks(booksData);
    setIsLoading(false);
    console.log(booksData);
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    setIsLoading(false);
  }
};

  useEffect(() => {
    getAllBooks()
  }, [])
  
  if (isLoading) return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }}></ActivityIndicator>;

  return (
    <View style={{ padding: 0, marginTop: 45 }}>
      <Text style={{fontSize:30,fontWeight:900,alignSelf:"center"}}>Okumaya Devam Edin</Text>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={Object.values(books)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: any }) => (
          <MyLibraryBook
            book={item}
          />
        )}
      />
    </View>
  );
}
