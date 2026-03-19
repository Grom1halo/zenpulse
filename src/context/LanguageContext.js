import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    // Paywall
    heroTitle: 'ZenPulse',
    heroSubtitle: 'Transform your mind.\nOne breath at a time.',
    benefitsTitle: 'Everything in Premium',
    benefits: [
      { icon: '🧘', text: '50+ guided meditation sessions' },
      { icon: '🌙', text: 'Sleep soundscapes & bedtime stories' },
      { icon: '🤖', text: 'AI Mood affirmations, personalized daily' },
      { icon: '📊', text: 'Progress tracking & streaks' },
      { icon: '🔇', text: 'Offline listening, no ads ever' },
    ],
    planYearly: 'Yearly',
    planMonthly: 'Monthly',
    bestValue: 'BEST VALUE',
    save: 'Save 72%',
    ctaButton: 'Try Free for 7 Days',
    ctaSubYearly: 'Then $39.99/yr · Cancel anytime',
    ctaSubMonthly: 'Then $11.99/mo · Cancel anytime',
    terms: 'No charge today. Restore purchases · Privacy Policy · Terms',

    // Meditations
    greeting: 'Good morning 🌸',
    yourSessions: 'Your Sessions',
    goPremium: '✨ Go Premium',
    streakTitle: '3-day streak!',
    streakSub: 'Keep the momentum going',
    premiumOnly: 'Premium only',

    // Mood
    moodTitle: 'AI Mood of the Day',
    moodSubtitle: "How are you feeling right now?\nI'll create a personal affirmation for you.",
    back: '← Back',
    generate: '✨ Generate Affirmation',
    generating: 'Generating...',
    newAffirmation: '🔄 New affirmation',
    changeMood: 'Change mood',
    aiNote: '🤖 Powered by AI · Personalized per your mood state',
    forMood: 'For your',
    mood: 'mood',
    moods: [
      { emoji: '😔', label: 'Anxious', key: 'anxious' },
      { emoji: '😐', label: 'Neutral', key: 'neutral' },
      { emoji: '😊', label: 'Joyful', key: 'joyful' },
    ],
  },
  ru: {
    // Paywall
    heroTitle: 'ZenPulse',
    heroSubtitle: 'Измени своё мышление.\nОдин вдох за раз.',
    benefitsTitle: 'Всё включено в Premium',
    benefits: [
      { icon: '🧘', text: '50+ медитаций с голосовым сопровождением' },
      { icon: '🌙', text: 'Звуки для сна и истории на ночь' },
      { icon: '🤖', text: 'AI аффирмации, персональные каждый день' },
      { icon: '📊', text: 'Отслеживание прогресса и серий' },
      { icon: '🔇', text: 'Офлайн-слушание, никакой рекламы' },
    ],
    planYearly: 'Годовой',
    planMonthly: 'Месячный',
    bestValue: 'ВЫГОДНЕЕ',
    save: 'Скидка 72%',
    ctaButton: '7 дней бесплатно',
    ctaSubYearly: 'Затем 3 990₽/год · Отмена в любой момент',
    ctaSubMonthly: 'Затем 990₽/мес · Отмена в любой момент',
    terms: 'Сегодня без оплаты. Восстановить покупки · Политика · Условия',

    // Meditations
    greeting: 'Доброе утро 🌸',
    yourSessions: 'Ваши сессии',
    goPremium: '✨ Premium',
    streakTitle: 'Серия 3 дня!',
    streakSub: 'Не останавливайся',
    premiumOnly: 'Только Premium',

    // Mood
    moodTitle: 'AI Настрой дня',
    moodSubtitle: 'Как ты себя чувствуешь?\nЯ создам личную аффирмацию для тебя.',
    back: '← Назад',
    generate: '✨ Сгенерировать аффирмацию',
    generating: 'Генерирую...',
    newAffirmation: '🔄 Новая аффирмация',
    changeMood: 'Сменить настрой',
    aiNote: '🤖 На основе AI · Персонально под твоё настроение',
    forMood: 'Для твоего настроения',
    mood: '',
    moods: [
      { emoji: '😔', label: 'Тревога', key: 'anxious' },
      { emoji: '😐', label: 'Нейтральный', key: 'neutral' },
      { emoji: '😊', label: 'Радость', key: 'joyful' },
    ],
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggleLang = () => setLang((l) => (l === 'en' ? 'ru' : 'en'));
  const t = TRANSLATIONS[lang];
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
