import { View, Text, Image, TouchableOpacity,StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Book } from "@/types";
import { Ionicons } from '@expo/vector-icons'

const BookModal = ({book}:{book:Book}) => {
    const router = useRouter()
    return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={()=> router.push({pathname: '/book/[bookId]', params: { bookId: book.id }})}
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
        <Text style={styles.title} numberOfLines={0}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        
        {/*
        <View style={styles.detailsContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>{pages} sayfa</Text>
            <Text style={styles.metaText}>•</Text>
            <Text style={styles.metaText}>{year}</Text>
          </View>
        </View>
        */}
      </View>
      
      <View style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={20} color="#666" />
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