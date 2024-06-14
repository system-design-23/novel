import { createContext, useEffect, useState } from 'react';
import { login as apiLogin, validate } from '../apis/auth';

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogginIn, setIsLogginIn] = useState(false);

  useEffect(() => {
    const revalidate = async () => {
      if (localStorage.getItem('accessToken')) {
        const result = await validate(localStorage.getItem('accessToken'));
        if (result) {
          setUser({ username: result.fullname, isAdmin: result.role === 'admin' });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
    };

    revalidate();
  }, []);

  const login = async (user) => {
    setIsLogginIn(true);
    try {
      const loginResponse = await apiLogin(user.username, user.password);
      if (loginResponse) {
        setUser({ username: user.username, isAdmin: loginResponse.authorization === 'admin' });
        localStorage.setItem('accessToken', loginResponse.accessToken);
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLogginIn(false);
    }
    return true;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return true;
  };

  return <AuthContext.Provider value={{ user, login, logout, isLogginIn }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
