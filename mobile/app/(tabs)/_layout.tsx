import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

export default function App() {
    return (

        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="HomeScreen"
                options={{
                    title: 'Top Rated',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="trophy" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="CategorieScreen"
                options={{
                    title: 'Categories',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="library" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="SearchScreen"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="LibraryScreen"
                options={{
                    title: 'My Library',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="book" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
