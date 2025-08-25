import BookModal from "@/components/Book";
import { useBooks } from "@/hooks/useBooks";
import { Book } from "@/types";
import { useRouter } from "expo-router";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { data: books, isLoading, error } = useBooks();
  const router = useRouter()
  if (isLoading) return <ActivityIndicator style={{flex:1,justifyContent:"center"}}></ActivityIndicator>;
  if (error) return <Text>Hata: {error.message}</Text>;

  return (
    <SafeAreaView style={{flex: 1,padding:5}}>
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
    </SafeAreaView>
  );
}
