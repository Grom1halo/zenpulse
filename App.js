import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SubscriptionProvider } from './src/context/SubscriptionContext';
import PaywallScreen from './src/screens/PaywallScreen';
import MeditationsScreen from './src/screens/MeditationsScreen';
import MoodScreen from './src/screens/MoodScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Paywall"
            screenOptions={{ headerShown: false, gestureEnabled: true }}
          >
            <Stack.Screen name="Paywall" component={PaywallScreen} />
            <Stack.Screen name="Meditations" component={MeditationsScreen} />
            <Stack.Screen name="Mood" component={MoodScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SubscriptionProvider>
    </SafeAreaProvider>
  );
}
