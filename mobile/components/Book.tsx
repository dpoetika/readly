import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Book } from "@/types";
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookModal = ({ book }: { book: Book }) => {
  const [favs, setFavs] = useState<Book[]>([]);
  const router = useRouter();

  const getItems = async () => {
    try {
      const likedBooks = await AsyncStorage.getItem("favs");
      if (likedBooks) {
        setFavs(JSON.parse(likedBooks));
      } else {
        setFavs([]);
      }
    } catch (error) {
      console.error('Favs çekme hatası:', error);
      setFavs([]);
    }
  };

  const toggleLike = async () => {
    try {
      let newFavs: Book[];
      
      if (isLiked()) {
        newFavs = favs.filter(favBook => favBook.id !== book.id);
      } else {
        newFavs = [...favs, book];
      }
      
      setFavs(newFavs);
      await AsyncStorage.setItem("favs", JSON.stringify(newFavs));

    } catch (error) {
      console.error('Like hatası:', error);
    }
  };

  const isLiked = () => favs.some(favBook => favBook.id === book.id);

  useEffect(() => {
    getItems();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({ pathname: '/(book)/[bookId]', params: { bookId: book.id, bookName: book.title, bookAuthor: book.author } })}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.img }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
      </View>

      <View style={styles.favoriteButton}>
        <TouchableOpacity onPress={toggleLike}>
          {isLiked() ? (
            <Ionicons name="heart" size={20} color="red" />
          ) : (
            <Ionicons name="heart-outline" size={20} color="red" />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default BookModal;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 6,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    flexWrap: 'wrap',
    flexShrink: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E65100',
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 4,
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
})