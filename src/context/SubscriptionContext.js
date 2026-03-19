import React, { createContext, useContext, useState } from 'react';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = () => setIsSubscribed(true);
  const unsubscribe = () => setIsSubscribed(false);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, subscribe, unsubscribe }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
