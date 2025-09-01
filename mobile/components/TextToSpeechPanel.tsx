import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

type TextToSpeechPanelProps = {
    // State değerleri
    isSpeaking: boolean;
    isPaused: boolean;
    isBookReading: boolean;
    currentChunkIndex: number;
    totalChunks: number;
    rate: number;
    pitch: number;
    selectedVoice: string | null;
    

    startSpeaking: (text: string, options?: any) => void;
    pauseSpeaking: () => void;
    resumeSpeaking: () => void;
    stopSpeaking: () => void;
    increaseRate: () => void;
    decreaseRate: () => void;
    increasePitch: () => void;
    decreasePitch: () => void;
    
    // Kitap okuma fonksiyonları
    handleStartReading: () => void;
    nextChunk: () => void;
    previousChunk: () => void;
    
    // UI state
    showTtsProgress: boolean;
}

const TextToSpeechPanel = ({
    isSpeaking,
    isPaused,
    isBookReading,
    currentChunkIndex,
    totalChunks,
    rate,
    pitch,
    selectedVoice,
    startSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    increaseRate,
    decreaseRate,
    increasePitch,
    decreasePitch,
    handleStartReading,
    nextChunk,
    previousChunk,
    showTtsProgress
}: TextToSpeechPanelProps) => {
    
    // Markdown formatındaki _text_ yapısını temizle
    const cleanMarkdownText = (text: string): string => {
        return text
            .replace(/_([^_]+)_/g, '$1') // _text_ -> text
            .replace(/\*\*([^*]+)\*\*/g, '$1') // **text** -> text
            .replace(/\*([^*]+)\*/g, '$1') // *text* -> text
            .replace(/`([^`]+)`/g, '$1') // `text` -> text
            .replace(/#{1,6}\s+/g, '') // # ## ### -> boş
            .replace(/\n+/g, ' ') // Çoklu satır sonlarını tek boşluğa çevir
            .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa çevir
            .trim();
    };

    return (
        <View style={styles.ttsContainer}>
            {/* Ana Kontroller */}
            <View style={styles.mainControls}>
                {!isBookReading ? (
                    <>
                        <TouchableOpacity style={[styles.button, styles.playButton]} onPress={handleStartReading}>
                            <Ionicons name="play" size={24} color="white" />
                            <Text style={styles.buttonText}>Oku</Text>
                        </TouchableOpacity>
                        {/* Test butonu */}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#007AFF' }]}
                            onPress={() => {
                                console.log('Test TTS çağrıldı');
                                const testText = "_Hello world_. This is a **test** with `markdown` formatting.";
                                const cleanedText = cleanMarkdownText(testText);
                                console.log('Orijinal metin:', testText);
                                console.log('Temizlenmiş metin:', cleanedText);

                                startSpeaking(cleanedText, {
                                    rate: rate,
                                    pitch: pitch,
                                    language: 'en',
                                    voice: selectedVoice || undefined
                                });
                            }}
                        >
                            <Ionicons name="mic" size={24} color="white" />
                            <Text style={styles.buttonText}>Test</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {isPaused || !isSpeaking ? (
                            <TouchableOpacity style={[styles.button, styles.playButton]} onPress={resumeSpeaking}>
                                <Ionicons name="play" size={24} color="white" />
                                <Text style={styles.buttonText}>Devam</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={pauseSpeaking}>
                                <Ionicons name="pause" size={24} color="white" />
                                <Text style={styles.buttonText}>Duraklat</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopSpeaking}>
                            <Ionicons name="stop" size={24} color="white" />
                            <Text style={styles.buttonText}>Durdur</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* Kitap Okuma İlerlemesi */}
            {showTtsProgress && (
                <View style={styles.progressContainer}>
                    {totalChunks > 0 ? (
                        <Text style={styles.progressText}>
                            Sayfa {currentChunkIndex + 1} / {totalChunks}
                        </Text>
                    ) : (
                        <Text style={styles.progressText}>Hazırlanıyor...</Text>
                    )}
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: totalChunks > 0 ? `${((currentChunkIndex + 1) / totalChunks) * 100}%` : '0%' }
                            ]}
                        />
                    </View>

                    {/* Chunk Navigasyon Tuşları */}
                    {isBookReading && totalChunks > 1 && (
                        <View style={styles.navigationContainer}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={{ disabled: currentChunkIndex <= 0 }}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                style={[styles.navButton, currentChunkIndex <= 0 && styles.navButtonDisabled]}
                                onPress={previousChunk}
                                disabled={currentChunkIndex <= 0}
                            >
                                <Ionicons name="play-back" size={20} color={currentChunkIndex <= 0 ? "#ccc" : "#333"} />
                                <Text style={[styles.navButtonText, currentChunkIndex <= 0 && styles.navButtonTextDisabled]}>Önceki</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={{ disabled: currentChunkIndex >= totalChunks - 1 }}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                style={[styles.navButton, currentChunkIndex >= totalChunks - 1 && styles.navButtonDisabled]}
                                onPress={nextChunk}
                                disabled={currentChunkIndex >= totalChunks - 1}
                            >
                                <Text style={[styles.navButtonText, currentChunkIndex >= totalChunks - 1 && styles.navButtonTextDisabled]}>Sonraki</Text>
                                <Ionicons name="play-forward" size={20} color={currentChunkIndex >= totalChunks - 1 ? "#ccc" : "#333"} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* Hız ve Perde Kontrolleri */}
            <View style={styles.speedPitchContainer}>
                <Text style={styles.sectionTitle}>Hız</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.smallButton} onPress={decreaseRate}>
                        <Text style={styles.smallButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.valueText}>{rate.toFixed(1)}</Text>
                    <TouchableOpacity style={styles.smallButton} onPress={increaseRate}>
                        <Text style={styles.smallButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Perde</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.smallButton} onPress={decreasePitch}>
                        <Text style={styles.smallButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.valueText}>{pitch.toFixed(1)}</Text>
                    <TouchableOpacity style={styles.smallButton} onPress={increasePitch}>
                        <Text style={styles.smallButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default TextToSpeechPanel

const styles = StyleSheet.create({

    ttsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    ttsHeader: {
        marginBottom: 15,
    },
    ttsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    mainControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 8,
        minWidth: 100,
    },
    playButton: {
        backgroundColor: '#4cd964',
    },
    pauseButton: {
        backgroundColor: '#ffcc00',
    },
    stopButton: {
        backgroundColor: '#ff3b30',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    controlGroup: {
        alignItems: 'center',
    },
    controlLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    controlButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        padding: 4,
    },
    disabledButton: {
        opacity: 0.5,
    },
    controlValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 12,
        minWidth: 40,
        textAlign: 'center',
    },
    voiceContainer: {
        marginTop: 10,
    },
    voiceButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedVoiceButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    voiceButtonText: {
        fontSize: 12,
        color: '#333',
    },
    selectedVoiceButtonText: {
        color: '#fff',
    },
    progressContainer: {
        marginTop: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    speedPitchContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    smallButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallButtonText: {
        fontSize: 24,
        color: '#333',
    },
    valueText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        minWidth: 40,
        textAlign: 'center',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        width: '100%',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
        color: '#333',
    },
    navButtonTextDisabled: {
        color: '#ccc',
    },
})