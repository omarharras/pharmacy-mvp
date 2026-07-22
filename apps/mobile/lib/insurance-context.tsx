import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  InsuranceProfile,
  InsuranceProfileInput,
  InsuranceStatus,
  createInsuranceProfile,
  deleteInsuranceProfile,
  getInsuranceProfiles,
  setDefaultInsuranceProfile,
} from './api';
import { useSession } from './session-context';

type InsuranceContextValue = {
  hasInsuranceProfile: boolean;
  isLoadingProfiles: boolean;
  profile: InsuranceProfile | null;
  profiles: InsuranceProfile[];
  reloadInsuranceProfiles: () => Promise<void>;
  removeInsuranceProfile: (profileId: string) => Promise<void>;
  saveInsuranceProfile: (profile: InsuranceProfileInput) => Promise<void>;
  setUseInsuranceByDefault: (profileId: string) => Promise<void>;
};

const InsuranceContext = createContext<InsuranceContextValue | null>(null);

type InsuranceProviderProps = {
  children: ReactNode;
};

export function InsuranceProvider({ children }: InsuranceProviderProps) {
  const { token } = useSession();
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [profiles, setProfiles] = useState<InsuranceProfile[]>([]);
  const profile = profiles.find((insuranceProfile) => insuranceProfile.useByDefault) ?? profiles[0] ?? null;

  const reloadInsuranceProfiles = useCallback(async () => {
    if (!token) {
      setProfiles([]);
      return;
    }

    setIsLoadingProfiles(true);

    try {
      setProfiles(await getInsuranceProfiles(token));
    } catch {
      setProfiles([]);
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [token]);

  useEffect(() => {
    void reloadInsuranceProfiles();
  }, [reloadInsuranceProfiles]);

  const value = useMemo<InsuranceContextValue>(
    () => ({
      hasInsuranceProfile: Boolean(profile),
      isLoadingProfiles,
      profile,
      profiles,
      reloadInsuranceProfiles,
      removeInsuranceProfile: async (profileId) => {
        if (!token) {
          return;
        }

        await deleteInsuranceProfile(profileId, token);
        await reloadInsuranceProfiles();
      },
      saveInsuranceProfile: async (nextProfile) => {
        if (!token) {
          return;
        }

        await createInsuranceProfile(nextProfile, token);
        await reloadInsuranceProfiles();
      },
      setUseInsuranceByDefault: async (profileId) => {
        if (!token) {
          return;
        }

        await setDefaultInsuranceProfile(profileId, token);
        await reloadInsuranceProfiles();
      },
    }),
    [isLoadingProfiles, profile, profiles, reloadInsuranceProfiles, token],
  );

  return <InsuranceContext.Provider value={value}>{children}</InsuranceContext.Provider>;
}

export function useInsurance() {
  const context = useContext(InsuranceContext);

  if (!context) {
    throw new Error('useInsurance must be used within InsuranceProvider');
  }

  return context;
}

export function insuranceStatusCopy(status: InsuranceStatus) {
  if (status === 'VERIFIED') {
    return 'Verified';
  }

  if (status === 'PENDING_REVIEW') {
    return 'In review';
  }

  return 'Not verified';
}
