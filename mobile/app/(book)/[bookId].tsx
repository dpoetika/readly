import { SafeAreaView, StatusBar, StyleSheet, Text, FlatList, NativeScrollEvent, NativeSyntheticEvent, View, TouchableOpacity } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useBookById } from '@/hooks/useBooks';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoadingComponent from '@/components/LoadingComponent';
import TextToSpeechPanel from '@/components/TextToSpeechPanel';
import { Ionicons } from '@expo/vector-icons';

const FONT_SIZE = 16;
const LINE_HEIGHT = 24;
const CHUNK_SIZE = 3000;

const BookScreen = () => {
  const { bookId, bookName, bookAuthor } = useLocalSearchParams<{ bookId: string, bookName: string, bookAuthor: string }>();
  const navigation = useNavigation();
  const id = Array.isArray(bookId) ? bookId[0] : bookId;
  const { data, isLoading, error } = useBookById(id!);
  const flatListRef = useRef<FlatList>(null);
  const [isScrollingToPosition, setIsScrollingToPosition] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastSave, setLastSave] = useState("")

  // Text-to-Speech hook'us
  const {
    isSpeaking,
    isPaused,
    startSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    rate,
    pitch,
    increaseRate,
    decreaseRate,
    increasePitch,
    decreasePitch,
    selectedVoice,
    changeVoice,
    // Yeni eklenen özellikler
    startBookReading,
    currentChunkIndex,
    totalChunks,
    isBookReading,
    // Yeni eklenen chunk navigasyon fonksiyonları
    nextChunk,
    previousChunk,
    goToChunk
  } = useTextToSpeech();

  const TTS_CHUNK_SIZE = 1000;

  const saveTtsProgress = async (index: number) => {
    try {
      const key = `ttsProgress:${id}`;
      const payload = { index, chunkSize: TTS_CHUNK_SIZE, updatedAt: Date.now() };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
      // console.log('TTS progress saved:', payload);
    } catch (e) {
      console.error('TTS progress save error:', e);
    }
  };

  const loadTtsProgress = async (): Promise<{ index: number; chunkSize: number } | null> => {
    try {
      const key = `ttsProgress:${id}`;
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.index === 'number') return { index: parsed.index, chunkSize: parsed.chunkSize || TTS_CHUNK_SIZE };
      return null;
    } catch (e) {
      console.error('TTS progress load error:', e);
      return null;
    }
  };

  const loadScrollPosition = async (w: number, h: number) => {
    if (isScrolled) { return null }
    const getItem = await AsyncStorage.getItem("recentlyRead");

    if (getItem === null) {
      setIsScrolled(true)
      setIsScrollingToPosition(false);
      return
    }
    setLastSave(getItem)
    try {
      const currentBook = JSON.parse(getItem)[bookId];
      if (currentBook) {
        const savedScrollY = currentBook.page;
        const scrollY = Number(savedScrollY);

        if (flatListRef.current && scrollY > 0) {

          flatListRef.current.scrollToOffset({
            offset: scrollY,
            animated: true,
          });

          if (h > scrollY) {
            setIsScrolled(true)
            setIsScrollingToPosition(false);
          }
        } else {
          setIsScrolled(true)
          setIsScrollingToPosition(false);
        }
      } else {
        setIsScrolled(true)
        setIsScrollingToPosition(false);
      }
    } catch (error) {
      console.error('Scroll position load error:', error);
    }
  };

  const splitText = (text: string, size: number): string[] => {
    let chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
      chunks.push(text.slice(i, i + size));
    }
    return chunks;
  };

  const parts = useMemo(() => {
    if (!data?.data) return [];
    return splitText(data.data, CHUNK_SIZE);
  }, [data?.data]);

  const HandleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolled) { return null }
    const currentScrollY: Number = event.nativeEvent.contentOffset.y;

    let recentlyRead = lastSave ? JSON.parse(lastSave) : {};

    recentlyRead[bookId] = {
      id: bookId,
      page: currentScrollY,
      author: bookAuthor,
      title: bookName,
      img: `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.cover.medium.jpg`,
    };
    await AsyncStorage.setItem("recentlyRead", JSON.stringify(recentlyRead));
  }

  // Kitap okumaya başlat
  const handleStartReading = async () => {
    console.log('handleStartReading çağrıldı');
    console.log('data?.data mevcut mu:', !!data?.data);
    console.log('data?.data uzunluğu:', data?.data?.length);
    console.log('data?.data ilk 100 karakter:', data?.data?.substring(0, 100));

    if (data?.data) {
      console.log('TTS başlatılıyor...');
      console.log('Seçili ses:', selectedVoice);
      console.log('Hız:', rate);
      console.log('Perde:', pitch);

      try {
        // Önce varsa kayıtlı ilerlemeyi oku
        const progress = await loadTtsProgress();
        const startIndex = progress?.index ?? 0;
        const chunkSize = progress?.chunkSize ?? TTS_CHUNK_SIZE;
        console.log('Kayıtlı TTS ilerlemesi:', progress);

        // Bütün kitabı sırayla okumaya başla
        startBookReading(data.data, chunkSize, startIndex);
        console.log('Kitap okuma başlatıldı');
      } catch (error) {
        console.error('Kitap okuma başlatma hatası:', error);
      }
    } else {
      console.error('Kitap verisi bulunamadı');
      console.log('data objesi:', data);
    }
  };

  // TTS ilerlemesini değiştikçe kaydet
  React.useEffect(() => {
    if (isBookReading) {
      saveTtsProgress(currentChunkIndex);
    }
  }, [isBookReading, currentChunkIndex]);

  // İlerleme çubuğu görünürlüğünü güçlendir (konuşma sırasında da göster)
  const showTtsProgress = isBookReading || isSpeaking;

  // Ekran odaklandığında kayıtlı TTS ilerlemesi varsa otomatik başlat (kullanıcıya sormadan)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener?.('focus', async () => {
      try {
        const progress = await loadTtsProgress();
        if (progress && data?.data) {
          console.log('Focus ile otomatik TTS devam:', progress);
          startBookReading(data.data, progress.chunkSize, progress.index);
        }
      } catch (e) { }
    });
    return unsubscribe;
  }, [navigation, data?.data, startBookReading]);


  // Sesli okuma paneli görünürlüğü
  const [ttsVisible, setTtsVisible] = useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('ttsVisible');
        if (raw !== null) setTtsVisible(raw === 'true');
      } catch { }
    })();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('ttsVisible', String(ttsVisible)).catch(() => { });
    if (!ttsVisible && (isSpeaking || isBookReading)) {
      // Panel kapatılırsa aktif okuma varsa durdur
      stopSpeaking();
    }
  }, [ttsVisible, isSpeaking, isBookReading, stopSpeaking]);

  StatusBar.setHidden(true);

  if (isLoading) return <LoadingComponent />;
  if (error) return <Text>Hata: {error.message}</Text>;
  if (!data) return <Text>Veri bulunamadı</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* TTS Panel Toggle */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setTtsVisible(v => !v)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>Sesli Okuma</Text>
          <Ionicons name={ttsVisible ? 'chevron-up' : 'chevron-down'} size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* TTS Panel (Aç/Kapa) */}
      {ttsVisible && (
        <TextToSpeechPanel
          isSpeaking={isSpeaking}
          isPaused={isPaused}
          isBookReading={isBookReading}
          currentChunkIndex={currentChunkIndex}
          totalChunks={totalChunks}
          rate={rate}
          pitch={pitch}
          selectedVoice={selectedVoice}
          startSpeaking={startSpeaking}
          pauseSpeaking={pauseSpeaking}
          resumeSpeaking={resumeSpeaking}
          stopSpeaking={stopSpeaking}
          increaseRate={increaseRate}
          decreaseRate={decreaseRate}
          increasePitch={increasePitch}
          decreasePitch={decreasePitch}
          handleStartReading={handleStartReading}
          nextChunk={nextChunk}
          previousChunk={previousChunk}
          showTtsProgress={showTtsProgress}
        />
      )}

      {/* Kitap İçeriği */}
      <FlatList
        ref={flatListRef}
        style={[styles.bookContent, { opacity: isScrollingToPosition ? 0.2 : 1 }]}
        data={parts}
        scrollEventThrottle={10}
        onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => { HandleScroll(event) }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onContentSizeChange={(w, h) => loadScrollPosition(w, h)}
        renderItem={({ item }) => (
          <Text style={styles.text}>
            {item}
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    flex: 1,
    backgroundColor: '#fff',
  },
  bookContent: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
    padding: 10,
  },
});