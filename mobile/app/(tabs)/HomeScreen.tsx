import BookModal from "@/components/Book";
import LoadingComponent from "@/components/LoadingComponent";
import { useBooks } from "@/hooks/useBooks";
import { Book } from "@/types";
import { Text, FlatList, View } from "react-native";

export default function Index() {
  const { data: books, isLoading, error } = useBooks();
  if (isLoading) return <LoadingComponent/>;
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
