import CategoryCard from "@/components/CategoryCard";
import LoadingComponent from "@/components/LoadingComponent";
import { useCategories } from "@/hooks/useCategories";
import useTheme from "@/hooks/useTheme";
import { Category } from "@/types";
import { Text, FlatList, View } from "react-native";

export default function Index() {
    const { data: categories, isLoading, error } = useCategories();
    const {colors}=useTheme()
    if (isLoading) return <LoadingComponent/>;
    if (error) return <Text>Hata: {error.message}</Text>;

    return (
        <View style={{ flex: 1, padding: 0, paddingTop: 45 ,backgroundColor:colors.bg}}>
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
                        colors={colors}
                    />
                )}
            />
        </View>
    );
}
