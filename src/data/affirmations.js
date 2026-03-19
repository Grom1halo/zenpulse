// Mock LLM responses per mood
// In production: replace with real API call to OpenAI/Claude/etc.

export const MOODS = [
  { emoji: '😔', label: 'Anxious', key: 'anxious' },
  { emoji: '😐', label: 'Neutral', key: 'neutral' },
  { emoji: '😊', label: 'Joyful', key: 'joyful' },
];

export const AFFIRMATIONS = {
  anxious: [
    "Breathe. This moment is temporary. You have overcome every difficult day so far — 100% success rate.",
    "Your nervous system is strong. Inhale for 4 counts, hold for 4, exhale for 6. You are safe right now.",
    "Anxiety is just energy without direction. Let's redirect it: name three things you can touch right now.",
  ],
  neutral: [
    "You don't need to feel extraordinary every day. Today, being present is enough.",
    "A calm mind is a powerful mind. Take this moment to simply exist without judgment.",
    "Stillness is not emptiness — it's the space where clarity grows. You are exactly where you need to be.",
  ],
  joyful: [
    "Your joy is contagious and your light is real. Anchor this feeling — it's always available to you.",
    "This brightness you feel? It's your natural state. Let it radiate outward without holding back.",
    "Gratitude amplifies joy. Carry this energy forward — the best moments are still ahead of you.",
  ],
};

export const AFFIRMATIONS_RU = {
  anxious: [
    "Дыши. Этот момент временен. Ты справлялся со всеми трудными днями — 100% успех.",
    "Твоя нервная система сильна. Вдох на 4 счёта, задержка на 4, выдох на 6. Ты в безопасности.",
    "Тревога — это энергия без направления. Назови три вещи, которые ты можешь потрогать прямо сейчас.",
  ],
  neutral: [
    "Тебе не нужно чувствовать себя необыкновенно каждый день. Сегодня достаточно просто присутствовать.",
    "Спокойный ум — это сильный ум. Позволь себе просто существовать без осуждения.",
    "Тишина — это не пустота, это пространство где растёт ясность. Ты именно там, где нужно.",
  ],
  joyful: [
    "Твоя радость заразительна, а свет настоящий. Запомни это ощущение — оно всегда доступно тебе.",
    "Это сияние внутри — твоё естественное состояние. Позволь ему светить без ограничений.",
    "Благодарность усиливает радость. Неси эту энергию вперёд — лучшие моменты ещё впереди.",
  ],
};

export function getMockAffirmation(moodKey, lang = 'en') {
  const source = lang === 'ru' ? AFFIRMATIONS_RU : AFFIRMATIONS;
  const pool = source[moodKey] ?? source.neutral;
  return pool[Math.floor(Math.random() * pool.length)];
}
