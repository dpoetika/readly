import BookModal from "@/components/BooksList";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ backgroundColor: "red" }}>
        <BookModal />
      </View>
    </SafeAreaView>
  );
}
