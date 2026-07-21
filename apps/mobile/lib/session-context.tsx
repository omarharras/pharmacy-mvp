import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { Customer, signIn as signInRequest, signOut as signOutRequest, signUp as signUpRequest } from './api';

type SessionContextValue = {
  customer: Customer | null;
  isLoggedIn: boolean;
  signIn: (input: { password: string; phone: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (input: { fullName: string; password: string; phone: string }) => Promise<void>;
  token: string | null;
};

const SessionContext = createContext<SessionContextValue | null>(null);

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo<SessionContextValue>(
    () => ({
      customer,
      isLoggedIn: Boolean(customer),
      signIn: async (input) => {
        const session = await signInRequest(input);

        setCustomer(session.customer);
        setToken(session.token);
      },
      signOut: async () => {
        const currentToken = token;

        setCustomer(null);
        setToken(null);

        if (currentToken) {
          await signOutRequest(currentToken);
        }
      },
      signUp: async (input) => {
        const session = await signUpRequest(input);

        setCustomer(session.customer);
        setToken(session.token);
      },
      token,
    }),
    [customer, token],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }

  return context;
}
