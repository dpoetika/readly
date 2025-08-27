import BookModal from "@/components/Book";
import LottieView from "lottie-react-native";
import { Book } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, FlatList, ActivityIndicator, View, RefreshControl, ScrollView, Alert } from "react-native";
import EmptyComponent from "@/components/EmptyComponent";
import LoadingComponent from "@/components/LoadingComponent";

export default function Index() {

  const [recentlyBooks, setRecentlyBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllBooks();
    setRefreshing(false);
  };

  const getAllBooks = async () => {
    try {
      const recentlyRead = await AsyncStorage.getItem("recentlyRead");

      if (!recentlyRead) {
        setRecentlyBooks([]); // Boş dizi olarak ayarla
        setIsLoading(false);
        return;
      }

      const parsedData = JSON.parse(recentlyRead);
      const booksData: Book[] = Object.values(parsedData);

      setRecentlyBooks(booksData);
      setIsLoading(false);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      setRecentlyBooks([]); // Hata durumunda boş dizi olarak ayarla
      setIsLoading(false);
    }
  };

  const deleteBook = (bookId: string) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Deletion cancelled")
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const currentDB = await AsyncStorage.getItem("recentlyRead");
            let recentlyRead = currentDB ? JSON.parse(currentDB) : {};
            delete recentlyRead[bookId]
            await AsyncStorage.setItem("recentlyRead", JSON.stringify(recentlyRead));
            onRefresh()
          }
        }
      ],
      { cancelable: true } // Kullanıcı alert dışına tıklayarak kapatabilir
    );
  };


  useEffect(() => {
    getAllBooks()
  }, [])

  if (isLoading) return <LoadingComponent/>;

  return (
    <View style={{ padding: 0, marginTop: 45, flex: 1}}>
      <Text style={{ fontSize: 30, fontWeight: 900, alignSelf: "center" }}>Your Library</Text>
      <FlatList
        ListEmptyComponent={EmptyComponent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        data={recentlyBooks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }: { item: any }) => (
          <BookModal
            book={item}
            longPress={() => deleteBook(item.id)}
          />
        )}
      />      
    </View>
  );
}