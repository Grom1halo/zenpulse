# ZenPulse: AI Meditation App

Prototype built with **React Native + Expo** as a test assignment.

## Stack
- React Native 0.83 + Expo 55
- React Navigation v7 (Stack)
- expo-linear-gradient
- react-native-safe-area-context
- react-native-gesture-handler / reanimated

## Run locally
```bash
npm install
npx expo start
# Scan QR with Expo Go app, or press `a` for Android emulator
```

## Screens
| Screen | Description |
|---|---|
| **Paywall** | Premium subscription screen — monthly/yearly plans, benefits list, "Try Free" CTA |
| **Meditations** | Session grid — free cards playable, premium cards locked behind `isSubscribed` flag |
| **AI Mood** | Pick a mood emoji → AI generates a personalized affirmation (mock LLM with realistic delay) |

## Subscription Logic
`SubscriptionContext` holds a single `isSubscribed: boolean` flag.

```js
// Paywall taps "Try Free" → subscribe() → navigate to Meditations
// Meditations card tap → if (item.premium && !isSubscribed) navigate('Paywall')
```

Premium cards show a 🔒 emoji, grayed-out color, and "Premium only" label. On tap they redirect to the Paywall.

## How AI handled mobile specifics (navigation, SafeArea)

### What worked well
- **SafeAreaView + edges prop**: Prompted with `edges={['top', 'bottom']}` — AI correctly wrapped every screen, preventing content overlap with notch/home indicator on both iOS and Android.
- **Navigation flow**: `createStackNavigator` with `navigation.replace('Meditations')` after purchase (not `navigate`) — AI correctly used `replace` so users can't go back to Paywall via swipe.
- **ScrollView + `contentContainerStyle`**: AI kept `flex: 1` on the container and `paddingBottom` inside `contentContainerStyle`, avoiding the classic "last item hidden behind FAB" issue.

### What required manual correction
- **`Dimensions.get('window')` for card width**: AI initially used `flex: 1` inside a `flexWrap: 'wrap'` container, which collapses to zero width. Had to explicitly prompt: *"Calculate card width as `(screenWidth - paddingH*2 - gap) / 2` and set it as a fixed pixel value."*
- **`gap` prop in StyleSheet**: AI used `gap: 12` in the grid styles — valid in React Native 0.71+, but needed to verify RN version first.
- **LinearGradient inside TouchableOpacity**: AI sometimes put `overflow: 'hidden'` on the wrong element, breaking the border-radius clip. Fix: `overflow: 'hidden'` on `TouchableOpacity`, gradient fills its own container.

---

## Control Question Answer

### «С какими специфическими проблемами мобильной верстки ИИ справляется хуже всего?»

**Топ-3 проблемы, где ИИ требовал ручного контроля:**

1. **Фиксированные размеры vs. flex на разных экранах**
   ИИ часто предлагает `width: 160` вместо `(screenWidth - padding) / columns`. На iPhone SE (320pt wide) карточки вылезают за экран. Решение: явно промптить *"рассчитывай ширину через Dimensions.get('window').width"* и проверять на 320pt viewport.

2. **SafeArea и абсолютно спозиционированные элементы**
   FAB-кнопки и bottom-баннеры, позиционированные через `position: absolute, bottom: 24`, не учитывают высоту home indicator (34pt на iPhone без кнопки). ИИ добавлял `SafeAreaView` на контейнер, но не на сам FAB. Контроль: вручную проверять `bottom` отступы на симуляторе Pro Max и SE.

3. **ScrollView + KeyboardAvoidingView + flex**
   ИИ путается, когда `flex: 1` нужен на `SafeAreaView`, но `ScrollView` должен иметь `contentContainerStyle` без `flex`. При неправильном промпте экраны либо не скроллятся, либо схлопываются. Явный промпт: *"SafeAreaView flex:1, внутри ScrollView без flex, contentContainerStyle с paddingBottom"*.

**Как я контролировал:**
- Запускал в симуляторе на **iPhone SE (375pt)** и **Pro Max (430pt)** после каждого экрана.
- При «поехавшей» верстке делал скриншот и промптил: *"на этом скриншоте карточки не помещаются в 2 колонки на маленьком экране, исправь расчёт ширины"*.
- Всегда проверял `edges` prop у `SafeAreaView` — по умолчанию `['top','right','bottom','left']`, что добавляет лишние боковые отступы.
