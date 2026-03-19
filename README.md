# ZenPulse: AI Meditation App

Прототип мобильного приложения «ZenPulse», собранный на **React Native + Expo** в рамках тестового задания.

## Стек
- React Native 0.83 + Expo SDK 55
- Expo Router (файловая навигация)
- expo-linear-gradient
- react-native-safe-area-context
- react-native-web (для запуска в браузере)
- React Context API (подписка + язык)

## Запуск
```bash
npm install
npx expo start
# Нажми `w` — откроет в браузере
# Или отсканируй QR в Expo Go
```

## Экраны
| Экран | Описание |
|---|---|
| **Paywall** | Экран подписки — тарифы месяц/год, список преимуществ, кнопка «Try Free» |
| **Meditations** | Сетка сессий — бесплатные открыты, премиум заблокированы по флагу `isSubscribed` |
| **AI Mood** | Выбор настроения (3 эмодзи) → генерация аффирмации (mock LLM с реалистичной задержкой) |

## Логика подписки
`SubscriptionContext` хранит флаг `isSubscribed: boolean`.

```js
// Paywall → "Try Free" → subscribe() → router.replace('/meditations')
// Карточка → if (item.premium && !isSubscribed) → router.push('/paywall')
```

Премиум-карточки показывают 🔒, серый цвет и надпись "Premium only".

## Переключение языков
`LanguageContext` хранит `lang: 'en' | 'ru'`. Кнопка показывает **текущий** язык (🇬🇧 EN / 🇷🇺 RU). Все тексты, названия сессий и категории переведены.

---

## Трудности и как они решались

### 1. Expo SDK 55 принудительно использует Expo Router
Самая неожиданная проблема — Expo 55 игнорирует `index.js` и ожидает файловую структуру `app/`. Metro возвращал `application/json` вместо JS-бандла с ошибкой `transform.routerRoot=app`. Пришлось полностью переписать навигацию с React Navigation на **Expo Router** и поменять `"main"` в `package.json` на `"expo-router/entry"`.

### 2. Отсутствие babel-preset-expo
После перехода на Expo Router Metro падал с `Cannot find module 'babel-preset-expo'`. Пакет не был включён в зависимости автоматически — установили вручную: `npm install babel-preset-expo`.

### 3. expo-linear-gradient в plugins
Изначально `expo-linear-gradient` был указан в `plugins` в `app.json`, что вызывало `PluginError: Unable to resolve a valid config plugin`. У этой библиотеки нет config plugin — убрали из `plugins`, оставили только в `dependencies`.

### 4. Запуск на телефоне через WireGuard VPN
Телефон подключался через WireGuard (IP ПК: `10.8.0.2`), но Expo Go выдавал `Failed to download remote update`. Перебрали несколько решений:
- Добавили правила Windows Firewall для порта 8081 — не помогло
- Попытались изменить сетевой профиль WireGuard с Public на Private — без результата
- Установили `REACT_NATIVE_PACKAGER_HOSTNAME=10.8.0.2` — Metro стал видеть правильный интерфейс, но маршрутизация между VPN-клиентами не была настроена на сервере
- **Итог**: использовали Chrome DevTools → Device Toolbar (эмуляция iPhone/Pixel) для демонстрации мобильного вида

### 5. Tunnel-режим (@expo/ngrok)
Пробовали `npx expo start --tunnel` — пакет `@expo/ngrok` устанавливался, но сразу выдавал `CommandError`. Проблема в несовместимости версии ngrok с Node.js окружения. Tunnel не использовали.

---

## Как ИИ справился с мобильной спецификой

### Что получилось хорошо
- **SafeAreaView + edges**: каждый экран обёрнут с `edges={['top','bottom']}`, контент не залезает на челку и home indicator
- **Навигация**: `router.replace('/meditations')` после покупки (не `push`) — пользователь не может вернуться на Paywall свайпом назад
- **ScrollView**: `flex:1` на контейнере, `contentContainerStyle` с `paddingBottom` — последний элемент не прячется за FAB-кнопку

### Что потребовало ручного контроля
- **Ширина карточек**: ИИ использовал `flex:1` внутри `flexWrap:'wrap'`, что схлопывалось в 0. Пришлось явно промптить расчёт через `Dimensions.get('window').width`
- **FAB и SafeArea**: кнопка "AI Mood" позиционировалась без учёта home indicator. Добавили `useSafeAreaInsets()` и `bottom: insets.bottom + 16`
- **gap в StyleSheet**: ИИ использовал `gap: 12` — работает в RN 0.71+, но нужна проверка версии

---

## Контрольный вопрос

### «С какими специфическими проблемами мобильной верстки ИИ справляется хуже всего и как ты контролировал его работу?»

**Топ-3 проблемы:**

**1. Фиксированные размеры vs. адаптив**
ИИ предлагает `width: 160` вместо `(screenWidth - padding) / columns`. На iPhone SE (375pt) карточки вылезают за экран. Решение: явно промптить *«рассчитывай ширину через Dimensions.get('window').width»* и проверять на 375pt и 430pt viewport.

**2. SafeArea для абсолютных элементов**
FAB и bottom-баннеры с `position: absolute, bottom: 24` не учитывают home indicator (34pt на iPhone без кнопки). ИИ добавлял SafeAreaView на контейнер, но не на сам FAB. Контроль: вручную проверять отступы на симуляторе SE и Pro Max.

**3. ScrollView + flex + KeyboardAvoidingView**
ИИ путается когда `flex:1` нужен на SafeAreaView, но ScrollView должен иметь `contentContainerStyle` без flex. При неправильном промпте экраны либо не скроллятся, либо схлопываются. Явный промпт: *«SafeAreaView flex:1, внутри ScrollView без flex, contentContainerStyle с paddingBottom»*.

**Метод контроля:**
- Тестировал в браузере с Device Toolbar на ширинах 375px (SE), 390px (iPhone 14), 430px (Pro Max)
- При «поехавшей» верстке делал скриншот и описывал проблему ИИ конкретно: *«карточки не помещаются в 2 колонки, исправь расчёт ширины»*
- Проверял `edges` у каждого SafeAreaView — лишние боковые отступы ломают grid-раскладку
