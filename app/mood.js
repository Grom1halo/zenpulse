import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useLanguage } from '../src/context/LanguageContext';
import { getMockAffirmation } from '../src/data/affirmations';

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [affirmation, setAffirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { lang, toggleLang, t } = useLanguage();

  const handleGenerate = () => {
    if (!selectedMood) return;
    setLoading(true);
    setAffirmation(null);
    fadeAnim.setValue(0);
    setTimeout(() => {
      const text = getMockAffirmation(selectedMood.key, lang);
      setAffirmation(text);
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 1400);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setAffirmation(null);
    fadeAnim.setValue(0);
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setAffirmation(null);
    fadeAnim.setValue(0);
  };

  return (
    <LinearGradient colors={['#FFF6EE', '#FFE9D8', '#FDE0CC']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← {t.back}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtn} onPress={toggleLang} activeOpacity={0.8}>
            <Text style={styles.langBtnText}>{lang === 'en' ? '🇬🇧 EN' : '🇷🇺 RU'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t.moodTitle}</Text>
          <Text style={styles.subtitle}>{t.moodSubtitle}</Text>

          {/* Mood picker */}
          <View style={styles.moodRow}>
            {t.moods.map((mood) => {
              const isSelected = selectedMood?.key === mood.key;
              return (
                <TouchableOpacity
                  key={mood.key}
                  style={[styles.moodBtn, isSelected && styles.moodBtnSelected]}
                  onPress={() => handleMoodSelect(mood)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Generate button */}
          {!affirmation && (
            <TouchableOpacity
              style={[styles.generateBtn, !selectedMood && styles.generateBtnDisabled]}
              onPress={handleGenerate}
              disabled={!selectedMood || loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.generateText}>{t.generating}</Text>
                </View>
              ) : (
                <View style={[styles.generateInner, { backgroundColor: selectedMood ? '#C97B4B' : '#D4B8A0' }]}>
                  <Text style={styles.generateText}>{t.generate}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Affirmation result */}
          {affirmation && (
            <Animated.View style={[styles.affirmationCard, { opacity: fadeAnim }]}>
              <Text style={styles.affirmationMoodLine}>
                {selectedMood.emoji} {t.forMood} {selectedMood.label.toLowerCase()} {t.mood}:
              </Text>
              <Text style={styles.affirmationText}>"{affirmation}"</Text>
              <View style={styles.affirmationActions}>
                <TouchableOpacity style={styles.regenerateBtn} onPress={handleGenerate} activeOpacity={0.8}>
                  <Text style={styles.regenerateBtnText}>{t.newAffirmation}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
                  <Text style={styles.resetBtnText}>{t.changeMood}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {!affirmation && (
            <View style={styles.aiNote}>
              <Text style={styles.aiNoteText}>{t.aiNote}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8,
  },
  backBtn: { paddingVertical: 4 },
  backText: { color: '#9C6B4A', fontSize: 15, fontWeight: '600' },
  langBtn: {
    backgroundColor: 'rgba(180,100,60,0.1)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(180,100,60,0.2)',
  },
  langBtnText: { color: '#A0522D', fontSize: 13, fontWeight: '700' },

  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16, alignItems: 'center' },
  title: { color: '#3D1F0D', fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: '#9C6B4A', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 36 },

  moodRow: { flexDirection: 'row', gap: 16, marginBottom: 36 },
  moodBtn: {
    alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 2, borderColor: 'rgba(210,140,100,0.2)', minWidth: 90,
  },
  moodBtnSelected: { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: '#C97B4B' },
  moodEmoji: { fontSize: 36, marginBottom: 8 },
  moodLabel: { color: '#9C6B4A', fontSize: 13, fontWeight: '600' },
  moodLabelSelected: { color: '#3D1F0D' },

  generateBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
  generateBtnDisabled: { opacity: 0.6 },
  generateInner: { paddingVertical: 18, alignItems: 'center', borderRadius: 16 },
  loadingRow: {
    flexDirection: 'row', gap: 10, alignItems: 'center',
    paddingVertical: 18, backgroundColor: '#D4B8A0', justifyContent: 'center', borderRadius: 16,
  },
  generateText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  affirmationCard: {
    width: '100%', backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: 'rgba(210,140,100,0.3)', marginBottom: 24,
  },
  affirmationMoodLine: { color: '#C97B4B', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  affirmationText: { color: '#3D1F0D', fontSize: 17, lineHeight: 26, fontStyle: 'italic', fontWeight: '500', marginBottom: 20 },
  affirmationActions: { flexDirection: 'row', gap: 12 },
  regenerateBtn: {
    flex: 1, backgroundColor: 'rgba(201,123,75,0.15)', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#C97B4B',
  },
  regenerateBtnText: { color: '#C97B4B', fontWeight: '700', fontSize: 13 },
  resetBtn: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(210,140,100,0.3)',
  },
  resetBtnText: { color: '#9C6B4A', fontWeight: '600', fontSize: 13 },

  aiNote: { marginTop: 'auto', paddingBottom: 16 },
  aiNoteText: { color: '#B09070', fontSize: 12, textAlign: 'center' },
});
