import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useUser } from '@/lib/store/userStore.ts'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const UserRepository = RepositoryFactory.get('user')

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const updateUser = useUser(state => state.updateUser)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      (async function() {
        const info = await UserRepository.getInfoMe()
        updateUser(info.data)
      })()
      localStorage.setItem('token',token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token')
    }
  }, [token]);

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