import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Category } from '@/types'
import { useRouter } from 'expo-router'

const CategoryCard = ({ category }: { category: Category }) => {
  const router = useRouter()
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({
        pathname: '/(category)/[categoryId]',
        params: {
          categoryId: category.id,
          categoryTitle:category.title
        }
      })}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{category.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CategoryCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
})