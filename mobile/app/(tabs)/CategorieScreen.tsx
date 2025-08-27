import CategoryCard from "@/components/CategoryCard";
import LoadingComponent from "@/components/LoadingComponent";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types";
import { Text, FlatList, ActivityIndicator, View } from "react-native";

export default function Index() {
    const { data: categories, isLoading, error } = useCategories();
    if (isLoading) return <LoadingComponent/>;
    if (error) return <Text>Hata: {error.message}</Text>;

    return (
        <View style={{ flex: 1, padding: 0, marginTop: 45 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={categories}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ padding: 8 }}

                keyExtractor={(item) => item.id}
                renderItem={({ item }: { item: Category }) => (
                    <CategoryCard
                        category={item}
                    />
                )}
            />
        </View>
    );
}
