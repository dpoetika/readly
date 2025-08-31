import { useState, useEffect, useCallback, useRef } from 'react';
import * as Speech from 'expo-speech';

interface TextToSpeechOptions {
  rate?: number;
  pitch?: number;
  voice?: string;
  language?: string;
}

interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  isPaused: boolean;
  voices: Speech.Voice[];
  selectedVoice: string | null;
  rate: number;
  pitch: number;
  startSpeaking: (text: string, options?: TextToSpeechOptions) => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  stopSpeaking: () => void;
  changeVoice: (voiceId: string) => void;
  increaseRate: () => void;
  decreaseRate: () => void;
  increasePitch: () => void;
  decreasePitch: () => void;
  loadVoices: () => Promise<void>;
  // Yeni eklenen fonksiyonlar
  startBookReading: (fullText: string, chunkSize?: number, startIndex?: number) => void;
  currentChunkIndex: number;
  totalChunks: number;
  isBookReading: boolean;
  nextChunk: () => void;
  previousChunk: () => void;
  goToChunk: (index: number) => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voices, setVoices] = useState<Speech.Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [rate, setRate] = useState<number>(0.8);
  const [pitch, setPitch] = useState<number>(1.0);
  
  // Kitap okuma için yeni state'ler
  const [isBookReading, setIsBookReading] = useState<boolean>(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(0);
  const [totalChunks, setTotalChunks] = useState<number>(0);
  const [bookChunks, setBookChunks] = useState<string[]>([]);
  const readNextChunkRef = useRef<((text: string) => void) | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const restartingRef = useRef<boolean>(false);
  const lastOptionsRef = useRef<{ rate: number; pitch: number; voice: string | undefined } | null>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Mevcut sesleri yükleme
  const loadVoices = useCallback(async () => {
    console.log('loadVoices çağrıldı');
    try {
      const availableVoices = await Speech.getAvailableVoicesAsync();
      console.log('Ses sayısı:', availableVoices.length);
      
      setVoices(availableVoices);
      
      // İngilizce sesi bulmaya çalış, yoksa ilk sesi seç
      const englishVoice = availableVoices.find(voice => 
        voice.language.includes('en') || voice.language.includes('EN')
      );
      
      if (englishVoice) {
        console.log('İngilizce ses bulundu:', englishVoice);
        setSelectedVoice(englishVoice.identifier);
      } else if (availableVoices.length > 0) {
        console.log('İlk ses seçildi:', availableVoices[0]);
        setSelectedVoice(availableVoices[0].identifier);
      }
      
      console.log('Seçili ses ID:', selectedVoice);
    } catch (error) {
      console.error('Sesler yüklenirken hata oluştu:', error);
    }
  }, []);

  // Konuşmayı başlatma
  const startSpeaking = useCallback((text: string, options?: TextToSpeechOptions) => {
    console.log('startSpeaking çağrıldı');
    console.log('Metin uzunluğu:', text.length);
    console.log('Metin ilk 100 karakter:', text.substring(0, 100));
    console.log('Seçenekler:', options);
    console.log('Mevcut selectedVoice:', selectedVoice);
    
    if (text.trim() === '') {
      console.error('Okunacak metin bulunamadı.');
      return;
    }

    try {
      // Önce mevcut konuşmayı durdur
      Speech.stop();
      
      // Ses seçimi için öncelik sırası: options.voice > selectedVoice > ilk mevcut ses
      let voiceToUse = options?.voice || selectedVoice;
      if (!voiceToUse && voices.length > 0) {
        voiceToUse = voices[0].identifier;
        console.log('selectedVoice yok, ilk ses kullanılıyor:', voiceToUse);
      }

      // Metni TTS için optimize et
      const optimizedText = text
        .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa çevir
        .trim();

      const speechOptions = {
        voice: voiceToUse || undefined,
        rate: options?.rate ?? rate, // Null check için ?? kullan
        pitch: options?.pitch ?? pitch,
        language: options?.language || 'en',
        onStart: () => {
          console.log('TTS başladı - Metin uzunluğu:', optimizedText.length);
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onDone: () => {
          console.log('TTS tamamlandı');
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onStopped: () => {
          console.log('TTS durduruldu');
          setIsSpeaking(false);
          setIsPaused(false);
        },
        onError: (error: any) => {
          console.error('TTS hatası:', error);
          console.error('Hata detayı:', JSON.stringify(error, null, 2));
          setIsSpeaking(false);
          setIsPaused(false);
        },
      };

      console.log('Speech.speak çağrılıyor...');
      console.log('Speech options:', speechOptions);
      console.log('Optimized text length:', optimizedText.length);
      
      Speech.speak(optimizedText, speechOptions);
      console.log('Speech.speak çağrıldı');
    } catch (error) {
      console.error('Konuşma başlatılamadı:', error);
      console.error('Hata detayı:', JSON.stringify(error, null, 2));
      setIsSpeaking(false);
    }
  }, [selectedVoice, rate, pitch, voices]);

  // Konuşmayı duraklatma
  const pauseSpeaking = useCallback(() => {
    try {
      Speech.pause();
      setIsPaused(true);
    } catch (error) {
      console.error('Duraklatma hatası:', error);
    }
  }, []);

  // Konuşmayı devam ettirme
  const resumeSpeaking = useCallback(() => {
    try {
      // Android pause/resume may be limited; prefer safe re-speak of current chunk
      if (isBookReading && bookChunks[currentChunkIndex]) {
        setIsPaused(false);
        const currentText = bookChunks[currentChunkIndex];
        const call = readNextChunkRef.current;
        if (call) call(currentText);
      } else {
        Speech.resume();
        setIsPaused(false);
      }
    } catch (error) {
      console.error('Devam ettirme hatası:', error);
    }
  }, [isBookReading, bookChunks, currentChunkIndex]);

  // Kitap okumayı başlatma
  const startBookReading = useCallback((fullText: string, chunkSize: number = 1000, startIndex: number = 0) => {
    console.log('startBookReading çağrıldı');
    console.log('Tam metin uzunluğu:', fullText.length);
    console.log('Chunk boyutu:', chunkSize);
    console.log('Başlangıç index:', startIndex);
    
    try {
      const cleanText = fullText
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const chunks: string[] = [];
      for (let i = 0; i < cleanText.length; i += chunkSize) {
        chunks.push(cleanText.slice(i, i + chunkSize));
      }
      
      console.log('Toplam chunk sayısı:', chunks.length);
      setBookChunks(chunks);
      setTotalChunks(chunks.length);
      const safeStart = Math.max(0, Math.min(startIndex, Math.max(0, chunks.length - 1)));
      setCurrentChunkIndex(safeStart);
      setIsBookReading(true);
      
      if (chunks.length > 0) {
        const call = readNextChunkRef.current;
        if (call) call(chunks[safeStart]);
      }
    } catch (error) {
      console.error('Kitap okuma başlatılamadı:', error);
    }
  }, []);

  // Sonraki chunk'ı okuma
  const readNextChunk = useCallback((text: string) => {
    console.log(`Chunk ${currentChunkIndex + 1}/${totalChunks} okunuyor`);
    console.log('Chunk uzunluğu:', text.length);
    
    const speechOptions = {
      voice: selectedVoice || undefined,
      rate: rate,
      pitch: pitch,
      language: 'en',
      onStart: () => {
        console.log(`Chunk ${currentChunkIndex + 1} okunmaya başladı`);
        setIsSpeaking(true);
        setIsPaused(false);
        lastOptionsRef.current = { rate, pitch, voice: selectedVoice || undefined };
      },
      onDone: () => {
        console.log(`Chunk ${currentChunkIndex + 1} tamamlandı`);
        setIsSpeaking(false);
        // Duraklatılmışsa ilerleme yapma, mevcut indekste kal
        if (isPausedRef.current) {
          console.log('Duraklatıldı, otomatik ilerleme yapılmıyor');
          return;
        }
        setIsPaused(false);
        
        // Sonraki chunk'a geç
        if (currentChunkIndex < totalChunks - 1) {
          const nextIndex = currentChunkIndex + 1;
          setCurrentChunkIndex(nextIndex);
          setTimeout(() => {
            if (readNextChunkRef.current && bookChunks[nextIndex]) {
              readNextChunkRef.current(bookChunks[nextIndex]);
            }
          }, 500);
        } else {
          console.log('Kitap okuma tamamlandı!');
          setIsBookReading(false);
          setCurrentChunkIndex(0);
        }
      },
      onStopped: () => {
        console.log('Kitap okuma durduruldu');
        setIsSpeaking(false);
        // Duraklatma ile stop karışmasın diye state'leri bozmayalım
      },
      onError: (error: any) => {
        console.error('Chunk okuma hatası:', error);
        setIsSpeaking(false);
      },
    } as const;
    
    Speech.speak(text, speechOptions);
  }, [currentChunkIndex, totalChunks, selectedVoice, rate, pitch, bookChunks]);

  // readNextChunk referansını güncel tut
  useEffect(() => {
    readNextChunkRef.current = readNextChunk;
  }, [readNextChunk]);

  // Konuşmayı durdurma (kitap okumayı da durdur)
  const stopSpeaking = useCallback(() => {
    try {
      Speech.stop();
      setIsSpeaking(false);
      setIsPaused(false);
      setIsBookReading(false);
      setCurrentChunkIndex(0);
    } catch (error) {
      console.error('Durdurma hatası:', error);
    }
  }, []);

  // Ses seçimi
  const changeVoice = useCallback((voiceId: string) => {
    console.log('Ses değiştiriliyor:', voiceId);
    setSelectedVoice(voiceId);
    
    // Eğer şu anda konuşuyorsa, yeni sesle tekrar başlat
    if (isSpeaking) {
      stopSpeaking();
      // Kısa bir gecikme sonra tekrar başlat
      setTimeout(() => {
        // Burada mevcut metni tekrar okumaya başlayabilirsiniz
        console.log('Yeni sesle konuşma yeniden başlatılıyor');
      }, 100);
    }
  }, [isSpeaking, stopSpeaking]);

  // Konuşma hızını artırma
  const increaseRate = useCallback(() => {
    if (rate < 2.0) {
      const newRate = Math.min(rate + 0.1, 2.0);
      const roundedRate = parseFloat(newRate.toFixed(1));
      console.log('Hız artırılıyor:', rate, '->', roundedRate);
      setRate(roundedRate);
      
      // Eğer şu anda konuşuyorsa, yeni hızla tekrar başlat
      if (isSpeaking) {
        console.log('Yeni hızla konuşma yeniden başlatılıyor');
        // Burada mevcut metni yeni hızla tekrar okumaya başlayabilirsiniz
      }
    }
  }, [rate, isSpeaking]);

  // Konuşma hızını azaltma
  const decreaseRate = useCallback(() => {
    if (rate > 0.1) {
      const newRate = Math.max(rate - 0.1, 0.1);
      const roundedRate = parseFloat(newRate.toFixed(1));
      console.log('Hız azaltılıyor:', rate, '->', roundedRate);
      setRate(roundedRate);
      
      // Eğer şu anda konuşuyorsa, yeni hızla tekrar başlat
      if (isSpeaking) {
        console.log('Yeni hızla konuşma yeniden başlatılıyor');
        // Burada mevcut metni yeni hızla tekrar okumaya başlayabilirsiniz
      }
    }
  }, [rate, isSpeaking]);

  // Konuşma perdesini artırma
  const increasePitch = useCallback(() => {
    if (pitch < 2.0) {
      const newPitch = Math.min(pitch + 0.1, 2.0);
      const roundedPitch = parseFloat(newPitch.toFixed(1));
      console.log('Perde artırılıyor:', pitch, '->', roundedPitch);
      setPitch(roundedPitch);
      
      // Eğer şu anda konuşuyorsa, yeni perdeyle tekrar başlat
      if (isSpeaking) {
        console.log('Yeni perdeyle konuşma yeniden başlatılıyor');
        // Burada mevcut metni yeni perdeyle tekrar okumaya başlayabilirsiniz
      }
    }
  }, [pitch, isSpeaking]);

  // Konuşma perdesini azaltma
  const decreasePitch = useCallback(() => {
    if (pitch > 0.5) {
      const newPitch = Math.max(pitch - 0.1, 0.5);
      const roundedPitch = parseFloat(newPitch.toFixed(1));
      console.log('Perde azaltılıyor:', pitch, '->', roundedPitch);
      setPitch(roundedPitch);
      
      // Eğer şu anda konuşuyorsa, yeni perdeyle tekrar başlat
      if (isSpeaking) {
        console.log('Yeni perdeyle konuşma yeniden başlatılıyor');
        // Burada mevcut metni yeni perdeyle tekrar okumaya başlayabilirsiniz
      }
    }
  }, [pitch, isSpeaking]);

  // Sonraki chunk'a geç
  const nextChunk = useCallback(() => {
    if (!isBookReading || currentChunkIndex >= totalChunks - 1) return;
    
    console.log('Sonraki chunk\'a geçiliyor:', currentChunkIndex + 1, '->', currentChunkIndex + 2);
    
    // Mevcut konuşmayı durdur
    Speech.stop();
    
    const nextIndex = currentChunkIndex + 1;
    setCurrentChunkIndex(nextIndex);
    
    // Yeni chunk'ı okumaya başla
    if (bookChunks[nextIndex]) {
      setTimeout(() => {
        const call = readNextChunkRef.current;
        if (call) call(bookChunks[nextIndex]);
      }, 200);
    }
  }, [isBookReading, currentChunkIndex, totalChunks, bookChunks]);

  // Önceki chunk'a geç
  const previousChunk = useCallback(() => {
    if (!isBookReading || currentChunkIndex <= 0) return;
    
    console.log('Önceki chunk\'a geçiliyor:', currentChunkIndex + 1, '->', currentChunkIndex);
    
    // Mevcut konuşmayı durdur
    Speech.stop();
    
    const prevIndex = currentChunkIndex - 1;
    setCurrentChunkIndex(prevIndex);
    
    // Yeni chunk'ı okumaya başla
    if (bookChunks[prevIndex]) {
      setTimeout(() => {
        const call = readNextChunkRef.current;
        if (call) call(bookChunks[prevIndex]);
      }, 200);
    }
  }, [isBookReading, currentChunkIndex, bookChunks]);

  // Belirli bir chunk'a git
  const goToChunk = useCallback((index: number) => {
    if (!isBookReading || index < 0 || index >= totalChunks) return;
    
    console.log('Chunk\'a gidiliyor:', currentChunkIndex + 1, '->', index + 1);
    
    // Mevcut konuşmayı durdur
    Speech.stop();
    
    setCurrentChunkIndex(index);
    
    // Yeni chunk'ı okumaya başla
    if (bookChunks[index]) {
      setTimeout(() => {
        const call = readNextChunkRef.current;
        if (call) call(bookChunks[index]);
      }, 200);
    }
  }, [isBookReading, currentChunkIndex, totalChunks, bookChunks]);

  // İlk yüklemede sesleri yükle
  useEffect(() => {
    console.log('useEffect loadVoices çağrıldı');
    loadVoices();
  }, [loadVoices]);

  // selectedVoice değişikliklerini izle
  useEffect(() => {
    console.log('selectedVoice değişti:', selectedVoice);
  }, [selectedVoice]);

  // Hız/perde/ses değiştiğinde mevcut chunk'ı yeni ayarlarla yeniden başlat
  useEffect(() => {
    // Pause durumunda ya da kitap okumuyorken çalıştırma
    if (!isBookReading) return;
    if (isPausedRef.current) return;
    if (!bookChunks[currentChunkIndex]) return;

    const current = { rate, pitch, voice: selectedVoice || undefined };
    const prev = lastOptionsRef.current;
    // Ayarlarda gerçek bir değişiklik yoksa çık
    if (prev && prev.rate === current.rate && prev.pitch === current.pitch && prev.voice === current.voice) {
      return;
    }

    // Aynı anda birden fazla yeniden başlatmayı engelle
    if (restartingRef.current) return;
    restartingRef.current = true;

    console.log('Ayar değişti (rate/pitch/voice). Mevcut chunk yeniden başlatılıyor...');
    try {
      Speech.stop();
      const text = bookChunks[currentChunkIndex];
      const speechOptions = {
        voice: selectedVoice || undefined,
        rate: rate,
        pitch: pitch,
        language: 'en',
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
          lastOptionsRef.current = { rate, pitch, voice: selectedVoice || undefined };
        },
        onDone: () => {
          setIsSpeaking(false);
          if (isPausedRef.current) { restartingRef.current = false; return; }
          if (currentChunkIndex < totalChunks - 1) {
            const nextIndex = currentChunkIndex + 1;
            setCurrentChunkIndex(nextIndex);
            setTimeout(() => {
              const call = readNextChunkRef.current;
              if (call && bookChunks[nextIndex]) {
                call(bookChunks[nextIndex]);
              }
              restartingRef.current = false;
            }, 200);
          } else {
            setIsBookReading(false);
            setCurrentChunkIndex(0);
            restartingRef.current = false;
          }
        },
        onStopped: () => {
          setIsSpeaking(false);
          // stop sonrası guard'ı serbest bırak
          restartingRef.current = false;
        },
        onError: () => {
          setIsSpeaking(false);
          restartingRef.current = false;
        },
      } as const;
      Speech.speak(text, speechOptions);
    } catch (e) {
      console.error('Ayar değişikliğinde yeniden başlatılamadı:', e);
      restartingRef.current = false;
    }
  }, [rate, pitch, selectedVoice, isBookReading, bookChunks, currentChunkIndex, totalChunks]);

  return {
    isSpeaking,
    isPaused,
    voices,
    selectedVoice,
    rate,
    pitch,
    startSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    changeVoice,
    increaseRate,
    decreaseRate,
    increasePitch,
    decreasePitch,
    loadVoices,
    startBookReading,
    currentChunkIndex,
    totalChunks,
    isBookReading,
    nextChunk,
    previousChunk,
    goToChunk,
  };
};

export default useTextToSpeech;