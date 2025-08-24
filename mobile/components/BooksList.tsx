import { View, Text, FlatList } from "react-native";
import React from "react";
import { useBooks } from "@/hooks/useBooks";
import { Book } from "@/types";

const BookModal = () => {
    const { data: booksObj, isLoading, error } = useBooks();

    if (isLoading) return <Text>Yükleniyor...</Text>;
    if (error) return <Text>Hata: {error.message}</Text>;

    const booksEntries: [string, Book][] = booksObj ? Object.entries(booksObj) : [];
    return (
        <>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={booksEntries}
                keyExtractor={([key]) => key}
                renderItem={({ item: [key, book] }) => (
                    <View style={{ marginBottom: 10 }}>
                        <Text>{book.title}</Text>
                        <Text>{book.author}</Text>
                    </View>
                )}
            />
        </>
    );
};

export default BookModal;
