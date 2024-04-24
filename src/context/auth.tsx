import React, {createContext, useContext, useMemo} from 'react'
import {useUser} from '@/lib/store/userStore.ts'

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const {token, setToken} = useUser(state => state);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth: () => ({token: string; setToken: (t: string) => void}) = () => {
  return useContext(AuthContext);
};

export default AuthProvider;