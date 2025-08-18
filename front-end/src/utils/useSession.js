import { useCallback } from 'react';

const SESSION_KEY = 'session_user';

export default function useSession() {
  const saveSession = useCallback((data) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  }, []);

  const getSession = useCallback(() => {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }, []);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const updateAccess = useCallback((newAccess) => {
    const session = getSession();
    if (session) {
      session.access = newAccess;
      saveSession(session);
    }
  }, [getSession, saveSession]);

  return { saveSession, updateAccess, getSession, clearSession };
}
