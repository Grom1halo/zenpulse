import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSubscription } from '../src/context/SubscriptionContext';
import { useLanguage } from '../src/context/LanguageContext';

const PLANS = (t) => [
  {
    key: 'yearly',
    label: t.planYearly,
    price: '$39.99',
    period: '/ year',
    perMonth: '$3.33/mo',
    badge: t.bestValue,
    saving: t.save,
  },
  {
    key: 'monthly',
    label: t.planMonthly,
    price: '$11.99',
    period: '/ month',
    perMonth: null,
    badge: null,
    saving: null,
  },
];

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const { subscribe } = useSubscription();
  const { lang, toggleLang, t } = useLanguage();
  const router = useRouter();

  const handleSubscribe = () => {
    subscribe();
    router.replace('/meditations');
  };

  const plans = PLANS(t);

  return (
    <LinearGradient colors={['#FFF6EE', '#FFE9D8', '#FDE0CC']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Language toggle */}
        <TouchableOpacity style={styles.langBtn} onPress={toggleLang} activeOpacity={0.8}>
          <Text style={styles.langBtnText}>{lang === 'en' ? '🇬🇧 EN' : '🇷🇺 RU'}</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🌅</Text>
            <Text style={styles.heroTitle}>{t.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{t.heroSubtitle}</Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>{t.benefitsTitle}</Text>
            {t.benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{b.icon}</Text>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>

          {/* Plans */}
          <View style={styles.plansRow}>
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.key;
              return (
                <TouchableOpacity
                  key={plan.key}
                  style={[styles.planCard, isSelected && styles.planCardSelected]}
                  onPress={() => setSelectedPlan(plan.key)}
                  activeOpacity={0.8}
                >
                  {plan.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}
                  <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>{plan.label}</Text>
                  <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>{plan.price}</Text>
                  <Text style={[styles.planPeriod, isSelected && styles.planPeriodSelected]}>{plan.period}</Text>
                  {plan.perMonth && <Text style={styles.planPerMonth}>{plan.perMonth}</Text>}
                  {plan.saving && <Text style={styles.planSaving}>{plan.saving}</Text>}
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaButton} onPress={handleSubscribe} activeOpacity={0.85}>
            <View style={styles.ctaGradient}>
              <Text style={styles.ctaText}>{t.ctaButton}</Text>
              <Text style={styles.ctaSubText}>
                {selectedPlan === 'yearly' ? t.ctaSubYearly : t.ctaSubMonthly}
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.terms}>{t.terms}</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },

  langBtn: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 8,
    backgroundColor: 'rgba(180,100,60,0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(180,100,60,0.2)',
  },
  langBtnText: { color: '#A0522D', fontSize: 13, fontWeight: '700' },

  hero: { alignItems: 'center', paddingTop: 12, marginBottom: 28 },
  heroEmoji: { fontSize: 56 },
  heroTitle: { fontSize: 36, fontWeight: '700', color: '#3D1F0D', letterSpacing: 0.3, marginTop: 8 },
  heroSubtitle: { fontSize: 15, color: '#9C6B4A', textAlign: 'center', marginTop: 8, lineHeight: 22 },

  benefitsCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(210,140,100,0.2)',
  },
  benefitsTitle: {
    color: '#B07040', fontSize: 13, fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benefitIcon: { fontSize: 20, marginRight: 12 },
  benefitText: { color: '#5C3A1E', fontSize: 15, flex: 1 },

  plansRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  planCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 14,
    padding: 16, alignItems: 'center', borderWidth: 1.5,
    borderColor: 'rgba(210,140,100,0.25)', minHeight: 140, justifyContent: 'center',
  },
  planCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: '#C97B4B',
  },
  badge: {
    backgroundColor: '#C97B4B', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  planLabel: { color: '#A07050', fontSize: 13, fontWeight: '500', marginBottom: 4 },
  planLabelSelected: { color: '#5C3A1E' },
  planPrice: { color: '#7A4A28', fontSize: 24, fontWeight: '700' },
  planPriceSelected: { color: '#3D1F0D' },
  planPeriod: { color: '#A07050', fontSize: 12 },
  planPeriodSelected: { color: '#7A4A28' },
  planPerMonth: { color: '#C97B4B', fontSize: 11, marginTop: 4, fontWeight: '600' },
  planSaving: { color: '#7A9E5C', fontSize: 11, fontWeight: '600', marginTop: 2 },
  checkmark: {
    position: 'absolute', top: 10, right: 10, width: 20, height: 20,
    borderRadius: 10, backgroundColor: '#C97B4B', alignItems: 'center', justifyContent: 'center',
  },
  checkmarkText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  ctaButton: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  ctaGradient: {
    paddingVertical: 18, alignItems: 'center',
    backgroundColor: '#C97B4B', borderRadius: 16,
  },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.3 },
  ctaSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  terms: { color: '#B09070', fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
