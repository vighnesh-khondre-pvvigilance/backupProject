import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ClientUser, fetchClientProfile } from '../services/auth.service';
import { clearSession, getSession, saveSession } from '../storage/authStorage';

type AuthContextValue = {
  user: ClientUser | null;
  loading: boolean;
  completeLogin: (token: string, user: ClientUser) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<ClientUser | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const session = await getSession();
    if (!session.clientId) return;
    const result = await fetchClientProfile(session.clientId);
    if (result.success && result.user) setUser(result.user);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const session = await getSession();
        if (session.clientId) {
          const result = await fetchClientProfile(session.clientId);
          if (alive && result.success) setUser(result.user);
        }
      } catch {
        // Keep the user signed out if the backend cannot restore the profile.
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const completeLogin = useCallback(async (token: string, nextUser: ClientUser) => {
    await saveSession(token, nextUser.clientId);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, completeLogin, refreshProfile, logout, setUser }), [user, loading, completeLogin, refreshProfile, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
