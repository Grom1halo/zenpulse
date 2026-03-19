import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';
import { LanguageProvider } from '../src/context/LanguageContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SubscriptionProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
