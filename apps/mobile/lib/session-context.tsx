import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

import { Customer, getCurrentCustomer, signIn as signInRequest, signOut as signOutRequest, signUp as signUpRequest } from './api';
import { clearStoredAuthToken, getStoredAuthToken, storeAuthToken } from './auth-storage';

type SessionContextValue = {
  customer: Customer | null;
  isLoggedIn: boolean;
  isRestoringSession: boolean;
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
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedToken = await getStoredAuthToken();

        if (!storedToken) {
          return;
        }

        const restoredCustomer = await getCurrentCustomer(storedToken);

        if (!isMounted) {
          return;
        }

        setCustomer(restoredCustomer);
        setToken(storedToken);
      } catch {
        await clearStoredAuthToken();
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    };

    void restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      customer,
      isLoggedIn: Boolean(customer),
      isRestoringSession,
      signIn: async (input) => {
        const session = await signInRequest(input);

        setCustomer(session.customer);
        setToken(session.token);
        await storeAuthToken(session.token);
      },
      signOut: async () => {
        const currentToken = token;

        setCustomer(null);
        setToken(null);
        await clearStoredAuthToken();

        if (currentToken) {
          await signOutRequest(currentToken);
        }
      },
      signUp: async (input) => {
        const session = await signUpRequest(input);

        setCustomer(session.customer);
        setToken(session.token);
        await storeAuthToken(session.token);
      },
      token,
    }),
    [customer, isRestoringSession, token],
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
