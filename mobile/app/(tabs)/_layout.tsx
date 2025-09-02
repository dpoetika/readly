import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from '@expo/vector-icons';
import useTheme from "@/hooks/useTheme";

export default function App() {
    const {colors} = useTheme()
    return (
        <Tabs 
            screenOptions={{ 
                headerShown: false,
                // Tab bar arkaplan rengi
                tabBarStyle: {
                    backgroundColor: colors.bg, 
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: '#6366f1', 
                tabBarInactiveTintColor: '#94a3b8',
            }}
        >
            <Tabs.Screen
                name="index"
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