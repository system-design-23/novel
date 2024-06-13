import { createContext, useEffect, useState } from 'react';
import { login as apiLogin, validate } from '../apis/auth';

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      const result = validate(localStorage.getItem('accessToken'));
      if (result) {
        setUser({ username: result.username, isAdmin: result.role === 'admin' });
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    // const validate = async () => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     const user = await validateToken(token);
    //     setUser(user);
    //   }
    // };
    // validate();
  }, []);

  const login = async (user) => {
    // TODO: Implement login logic
    const loginResponse = await apiLogin(user.username, user.password);
    if (loginResponse) {
      setUser({ username: user.username, isAdmin: loginResponse.authorization === 'admin' });
      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
    }
    return true;
  };

  // const validateToken = async (token) => {
  //   // TODO: Implement token validation logic
  //   return { id: '1', username: token, isAdmin: true };
  // };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return true;
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
