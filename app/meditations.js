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
    <LinearGradient colors={['#0f0c29', '#1a1040', '#0d1b2a']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t.greeting}</Text>
            <Text style={styles.headline}>{t.yourSessions}</Text>
          </View>
          <View style={styles.headerRight}>
            {/* Language toggle */}
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
                <View style={[styles.cardAccent, { backgroundColor: locked ? '#374151' : item.color + '40' }]}>
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
                    <View style={[styles.categoryChip, { backgroundColor: locked ? '#374151' : item.color + '30' }]}>
                      <Text style={[styles.categoryText, { color: locked ? '#6B7280' : item.color }]}>
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
          <LinearGradient
            colors={['#C084FC', '#818CF8']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Text style={styles.fabEmoji}>🤖</Text>
            <Text style={styles.fabText}>AI Mood</Text>
          </LinearGradient>
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
  greeting: { color: '#9CA3AF', fontSize: 13 },
  headline: { color: '#F9FAFB', fontSize: 26, fontWeight: '800', marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  langBtnText: { fontSize: 16 },
  unlockBadge: {
    backgroundColor: 'rgba(192,132,252,0.2)', borderWidth: 1,
    borderColor: '#C084FC', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  unlockBadgeText: { color: '#C084FC', fontSize: 12, fontWeight: '700' },
  streakBanner: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20,
    marginBottom: 16, backgroundColor: 'rgba(251,191,36,0.1)', borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: 'rgba(251,191,36,0.2)', gap: 10,
  },
  streakEmoji: { fontSize: 28 },
  streakTitle: { color: '#FCD34D', fontSize: 15, fontWeight: '700' },
  streakSub: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, paddingBottom: 100 },
  card: {
    width: CARD_WIDTH, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  cardLocked: { backgroundColor: 'rgba(55,65,81,0.4)', borderColor: 'rgba(75,85,99,0.3)' },
  cardAccent: { height: 90, alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 36 },
  dimmed: { opacity: 0.4 },
  cardBody: { padding: 12 },
  cardTitle: { color: '#F3F4F6', fontSize: 14, fontWeight: '700', lineHeight: 20, marginBottom: 8 },
  cardTitleLocked: { color: '#6B7280' },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDuration: { color: '#9CA3AF', fontSize: 11 },
  categoryChip: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  categoryText: { fontSize: 10, fontWeight: '700' },
  lockedOverlay: { paddingHorizontal: 12, paddingBottom: 10 },
  lockedHint: { color: '#6B7280', fontSize: 11, fontStyle: 'italic' },
  fab: {
    position: 'absolute', bottom: 24, right: 20, borderRadius: 30, overflow: 'hidden',
    elevation: 8, shadowColor: '#C084FC', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabGradient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, gap: 8 },
  fabEmoji: { fontSize: 18 },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
