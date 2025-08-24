import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useBooks } from "@/hooks/useBooks";
import { Book } from "@/types";
import { useRouter } from "expo-router";

const BookModal = () => {
    const { data: books, isLoading, error } = useBooks();
    const router = useRouter()
    if (isLoading) return <Text>Yükleniyor...</Text>;
    if (error) return <Text>Hata: {error.message}</Text>;

    return (

        <FlatList
            showsVerticalScrollIndicator={false}
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => {
                        router.push({
                            pathname: '/book/[bookId]', params: { bookId: item.id }
                        })
                    }}>
                        <Text>{item.title}</Text>
                        <Text>{item.author}</Text>
                        <Image
                            source={{ uri: item.img }}
                            style={{ width: 50, height: 70, marginRight: 10 }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                </View>
            )}
        />

    );
};

export default BookModal;
