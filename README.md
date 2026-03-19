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

### 1. expo-linear-gradient в plugins
`expo-linear-gradient` был указан в `plugins` в `app.json`, что вызывало `PluginError: Unable to resolve a valid config plugin`. У этой библиотеки нет config plugin — убрали из `plugins`, оставили только в `dependencies`.

### 2. Expo SDK 55 принудительно использует Expo Router
Expo 55 игнорирует `index.js` и ожидает файловую структуру `app/`. Metro возвращал `application/json` вместо JS-бандла с ошибкой `transform.routerRoot=app`. Пришлось полностью переписать навигацию с React Navigation на **Expo Router** и поменять `"main"` в `package.json` на `"expo-router/entry"`.

### 3. Отсутствие babel-preset-expo
После перехода на Expo Router Metro падал с `Cannot find module 'babel-preset-expo'`. Пакет не был включён в зависимости автоматически — установили вручную: `npm install babel-preset-expo`.

### 4. Запуск на телефоне через WireGuard VPN
Телефон подключался через WireGuard (IP ПК: `10.8.0.2`), но Expo Go выдавал `Failed to download remote update`. Перебрали несколько решений:
- Добавили правила Windows Firewall для порта 8081 — не помогло
- Попытались изменить сетевой профиль WireGuard с Public на Private — не помогло
- Установили `REACT_NATIVE_PACKAGER_HOSTNAME=10.8.0.2` — Metro стал видеть правильный интерфейс, но маршрутизация между VPN-клиентами не была настроена на сервере
- **Итог**: использовали Chrome DevTools → Device Toolbar (эмуляция iPhone/Pixel) для демонстрации мобильного вида

### 5. Tunnel-режим (@expo/ngrok)
Пробовали `npx expo start --tunnel` — пакет `@expo/ngrok` устанавливался успешно, но сразу выдавал `CommandError`. Tunnel не использовали.

---

## Контрольный вопрос

### «С какими специфическими проблемами мобильной верстки ИИ справляется хуже всего и как ты контролировал его работу, чтобы приложение не сломалось на маленьких экранах?»

**Топ-3 проблемы:**

**1. Фиксированные размеры вместо адаптивных**
ИИ склонен предлагать `width: 160` вместо расчёта через `Dimensions.get('window').width`. На iPhone SE карточки вылезают за экран. Нужно явно промптить: *«рассчитывай ширину динамически через screenWidth»*.

**2. SafeArea для абсолютно спозиционированных элементов**
FAB-кнопки с `position: absolute, bottom: 24` не учитывают home indicator на iPhone. ИИ обычно добавляет SafeAreaView только на основной контейнер, но не на оверлейные элементы.

**3. ScrollView + flex**
ИИ часто путает где нужен `flex:1` — при неправильной вложенности экраны либо не скроллятся, либо схлопываются в 0 высоты. Явный промпт: *«SafeAreaView flex:1, внутри ScrollView без flex, contentContainerStyle с paddingBottom»*.

**Метод контроля:**
- Тестирование в Chrome DevTools Device Toolbar на ширинах 375px (SE) и 430px (Pro Max)
- При проблемах — конкретное описание бага ИИ со скриншотом, а не общий запрос «почему не работает»
