import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await validateToken(token);
        setUser(user);
      }
    };
    validate();
  }, []);

  const login = async (user) => {
    // TODO: Implement login logic
    setUser({ id: '1', username: user.username, isAdmin: true });
    // sample token
    const token = user.username;
    localStorage.setItem('token', token);
    return true;
  };

  const validateToken = async (token) => {
    // TODO: Implement token validation logic
    return { id: '1', username: token, isAdmin: true };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('token');
    return true;
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
