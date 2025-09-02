import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTheme from '@/hooks/useTheme';

export default function SettingsScreen() {
    const router = useRouter();
    const {colors,isDarkMode,toggleDarkMode} = useTheme()
    const [fontSize, setFontSize] = useState(16)

    const getFontSizeStorage = async () => {
        try {
            const FONT_SIZE = await AsyncStorage.getItem("FontSize")
            setFontSize(Number(FONT_SIZE))
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getFontSizeStorage()
    })
    
    const IncreaseFontSize = async (increase: number) => {
        if (fontSize <= 8 && increase === -1) { return null }
        await AsyncStorage.setItem("FontSize", String(fontSize + increase))
        setFontSize(prev => prev + (increase));

    }

    return (
        <View style={[styles.container,{backgroundColor:colors.bg}]}>
            <View style={[styles.header,{backgroundColor:colors.bg,borderColor:colors.border}]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle,{color:colors.text}]}>Ayarlar</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    {/* Display Section*/}
                    <Text style={styles.sectionTitle}>Display</Text>
                    <View style={[styles.sectionContent,{backgroundColor:colors.surface,borderColor:colors.border}]}>
                        {/* Theme */}
                        <View style={[styles.settingItem,{backgroundColor:colors.surface,borderColor:colors.border}]}>
                            <View style={styles.settingLeft}>
                                <Ionicons name={"moon"} size={22} color="#6366F1" />
                                <Text style={[styles.settingText,{color:colors.text}]}>Theme</Text>
                            </View>
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleDarkMode}
                                trackColor={{ false: '#ccc', true: '#6366F1' }}
                                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
                            />
                        </View>

                        {/* Font Settings */}
                        <View style={[styles.settingItem,{backgroundColor:colors.surface,borderColor:colors.border}]}>
                            <View style={styles.settingLeft}>
                                <Ionicons name={"text"} size={22} color="#6366F1" />
                                <Text style={[styles.settingText,{color:colors.text}]}>Font Size</Text>
                            </View>
                            <TouchableOpacity onPress={() => IncreaseFontSize(-1)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 24, color:colors.textMuted }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{color:colors.text}}>{fontSize}</Text>
                            <TouchableOpacity onPress={() => IncreaseFontSize(1)} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 24, color:colors.textMuted }}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: fontSize, lineHeight: fontSize + 8 ,marginTop:10,marginBottom:10,color:colors.text}}>This article shows you how {"\n"}your articles will look.</Text>
                    </View>


                    <Text style={[styles.sectionTitle,{paddingTop:10}]}>Contact</Text>
                    <View style={styles.section}>
                        <View style={[styles.sectionContent,{backgroundColor:colors.surface,borderColor:colors.border}]}>
                            {/* Support */}
                            <TouchableOpacity
                                style={[styles.settingItem,{backgroundColor:colors.surface,borderColor:colors.border}]}
                                onPress={() => Linking.openURL('https://github.com/dpoetika/readly')}
                            >
                                <View style={styles.settingLeft}>
                                    <Ionicons name={"logo-github"} size={22} color="#6366F1" />
                                    <Text style={[styles.settingText,{color:colors.text}]}>GitHub</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={styles.versionText}>Versiyon 1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop:45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        ...Platform.select({
            ios: {
                paddingTop: 50,
            },
        }),
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    placeholder: {
        width: 24,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    versionText: {
        textAlign: 'center',
        marginVertical: 25,
        color: '#999',
        fontSize: 14,
    },
});