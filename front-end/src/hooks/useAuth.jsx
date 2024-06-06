import { useContext } from 'react';
import { AuthContext } from '../contexts/Auth';

const useAuth = () => {
  const result = useContext(AuthContext);
  return result;
};

export default useAuth;
