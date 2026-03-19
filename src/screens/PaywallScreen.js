import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscription } from '../context/SubscriptionContext';

const { width } = Dimensions.get('window');

const PLANS = [
  {
    key: 'yearly',
    label: 'Yearly',
    price: '$39.99',
    period: '/ year',
    perMonth: '$3.33/mo',
    badge: 'BEST VALUE',
    saving: 'Save 72%',
  },
  {
    key: 'monthly',
    label: 'Monthly',
    price: '$11.99',
    period: '/ month',
    perMonth: null,
    badge: null,
    saving: null,
  },
];

const BENEFITS = [
  { icon: '🧘', text: '50+ guided meditation sessions' },
  { icon: '🌙', text: 'Sleep soundscapes & bedtime stories' },
  { icon: '🤖', text: 'AI Mood affirmations, personalized daily' },
  { icon: '📊', text: 'Progress tracking & streaks' },
  { icon: '🔇', text: 'Offline listening, no ads ever' },
];

export default function PaywallScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const { subscribe } = useSubscription();

  const handleSubscribe = () => {
    subscribe();
    navigation.replace('Meditations');
  };

  return (
    <LinearGradient colors={['#1a0533', '#2d1054', '#0d1f4e']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🌸</Text>
            <Text style={styles.heroTitle}>ZenPulse</Text>
            <Text style={styles.heroSubtitle}>
              Transform your mind.{'\n'}One breath at a time.
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>Everything in Premium</Text>
            {BENEFITS.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>{b.icon}</Text>
                <Text style={styles.benefitText}>{b.text}</Text>
              </View>
            ))}
          </View>

          {/* Plans */}
          <View style={styles.plansRow}>
            {PLANS.map((plan) => {
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
                  <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
                    {plan.label}
                  </Text>
                  <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.planPeriod, isSelected && styles.planPeriodSelected]}>
                    {plan.period}
                  </Text>
                  {plan.perMonth && (
                    <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
                  )}
                  {plan.saving && (
                    <Text style={styles.planSaving}>{plan.saving}</Text>
                  )}
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
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleSubscribe}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#C084FC', '#818CF8', '#60A5FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Try Free for 7 Days</Text>
              <Text style={styles.ctaSubText}>Then {selectedPlan === 'yearly' ? '$39.99/yr' : '$11.99/mo'} · Cancel anytime</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.terms}>
            No charge today. Restore purchases · Privacy Policy · Terms
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  // Hero
  hero: { alignItems: 'center', paddingTop: 24, marginBottom: 28 },
  heroEmoji: { fontSize: 56 },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#C4B5FD',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },

  // Benefits card
  benefitsCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  benefitsTitle: {
    color: '#E9D5FF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  benefitIcon: { fontSize: 20, marginRight: 12 },
  benefitText: { color: '#F3F4F6', fontSize: 15, flex: 1 },

  // Plans
  plansRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 140,
    justifyContent: 'center',
  },
  planCardSelected: {
    backgroundColor: 'rgba(192,132,252,0.2)',
    borderColor: '#C084FC',
  },
  badge: {
    backgroundColor: '#C084FC',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  planLabel: { color: '#9CA3AF', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  planLabelSelected: { color: '#E9D5FF' },
  planPrice: { color: '#E5E7EB', fontSize: 24, fontWeight: '800' },
  planPriceSelected: { color: '#FFFFFF' },
  planPeriod: { color: '#9CA3AF', fontSize: 12 },
  planPeriodSelected: { color: '#C4B5FD' },
  planPerMonth: { color: '#A78BFA', fontSize: 11, marginTop: 4, fontWeight: '600' },
  planSaving: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C084FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // CTA
  ctaButton: { borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
  ctaGradient: { paddingVertical: 18, alignItems: 'center' },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  ctaSubText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },

  terms: {
    color: '#6B7280',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
