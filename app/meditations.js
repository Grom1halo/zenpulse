import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSubscription } from '../src/context/SubscriptionContext';
import { useLanguage } from '../src/context/LanguageContext';
import { MEDITATIONS } from '../src/data/meditations';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

export default function MeditationsScreen() {
  const { isSubscribed } = useSubscription();
  const { lang, toggleLang, t } = useLanguage();
  const router = useRouter();

  const handleCardPress = (item) => {
    if (item.premium && !isSubscribed) router.push('/paywall');
  };

  return (
    <LinearGradient colors={['#FFF6EE', '#FFE9D8', '#FDE0CC']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t.greeting}</Text>
            <Text style={styles.headline}>{t.yourSessions}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.langBtn} onPress={toggleLang} activeOpacity={0.8}>
              <Text style={styles.langBtnText}>{lang === 'en' ? '🇬🇧' : '🇷🇺'}</Text>
            </TouchableOpacity>
            {!isSubscribed && (
              <TouchableOpacity style={styles.unlockBadge} onPress={() => router.push('/paywall')} activeOpacity={0.8}>
                <Text style={styles.unlockBadgeText}>{t.goPremium}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Streak */}
        <View style={styles.streakBanner}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>{t.streakTitle}</Text>
            <Text style={styles.streakSub}>{t.streakSub}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {MEDITATIONS.map((item) => {
            const locked = item.premium && !isSubscribed;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.card, locked && styles.cardLocked]}
                onPress={() => handleCardPress(item)}
                activeOpacity={locked ? 0.6 : 0.85}
              >
                <View style={[styles.cardAccent, { backgroundColor: locked ? '#E8D5C4' : item.color + '40' }]}>
                  <Text style={[styles.cardEmoji, locked && styles.dimmed]}>
                    {locked ? '🔒' : item.emoji}
                  </Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, locked && styles.cardTitleLocked]} numberOfLines={2}>
                    {item.title[lang]}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.cardDuration, locked && styles.dimmed]}>⏱ {item.duration}</Text>
                    <View style={[styles.categoryChip, { backgroundColor: locked ? '#E8D5C4' : item.color + '30' }]}>
                      <Text style={[styles.categoryText, { color: locked ? '#B09070' : '#5C3A1E' }]}>
                        {item.category[lang]}
                      </Text>
                    </View>
                  </View>
                </View>
                {locked && (
                  <View style={styles.lockedOverlay}>
                    <Text style={styles.lockedHint}>{t.premiumOnly}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* AI Mood FAB */}
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/mood')} activeOpacity={0.85}>
          <View style={styles.fabInner}>
            <Text style={styles.fabEmoji}>🤖</Text>
            <Text style={styles.fabText}>AI Mood</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8,
  },
  greeting: { color: '#9C6B4A', fontSize: 13 },
  headline: { color: '#3D1F0D', fontSize: 26, fontWeight: '800', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langBtn: {
    backgroundColor: 'rgba(180,100,60,0.1)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(180,100,60,0.2)',
  },
  langBtnText: { fontSize: 16 },
  unlockBadge: {
    backgroundColor: 'rgba(201,123,75,0.15)', borderWidth: 1,
    borderColor: '#C97B4B', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  unlockBadgeText: { color: '#C97B4B', fontSize: 12, fontWeight: '700' },

  streakBanner: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
    marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: 'rgba(210,140,100,0.25)', gap: 10,
  },
  streakEmoji: { fontSize: 28 },
  streakTitle: { color: '#C97B4B', fontSize: 15, fontWeight: '700' },
  streakSub: { color: '#9C6B4A', fontSize: 12, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, paddingBottom: 100 },
  card: {
    width: CARD_WIDTH, backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(210,140,100,0.2)',
  },
  cardLocked: { backgroundColor: 'rgba(230,210,195,0.5)', borderColor: 'rgba(180,140,110,0.2)' },
  cardAccent: { height: 90, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 36 },
  dimmed: { opacity: 0.4 },
  cardBody: { padding: 12 },
  cardTitle: { color: '#3D1F0D', fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 8 },
  cardTitleLocked: { color: '#B09070' },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDuration: { color: '#9C6B4A', fontSize: 11 },
  categoryChip: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  categoryText: { fontSize: 10, fontWeight: '700' },
  lockedOverlay: { paddingHorizontal: 12, paddingBottom: 10 },
  lockedHint: { color: '#B09070', fontSize: 11, fontStyle: 'italic' },

  fab: {
    position: 'absolute', bottom: 24, right: 20, borderRadius: 30, overflow: 'hidden',
    elevation: 8, shadowColor: '#C97B4B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  fabInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 20, gap: 8,
    backgroundColor: '#C97B4B', borderRadius: 30,
  },
  fabEmoji: { fontSize: 18 },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
