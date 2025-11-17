
"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// --- Subscription Context ---
type SubscriptionContextType = {
  subscriptionStatus: string | null;
  handleUpgrade: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider = ({ children, value }: { children: ReactNode, value: SubscriptionContextType }) => {
    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
};
// ----------------------------
