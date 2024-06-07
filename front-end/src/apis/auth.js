import axiosInstance from './axiosConfig';

const signup = async (username, password, fullname) => {
  const result = await axiosInstance.post('/auth/signup', { username, password, fullname });

  if (result.status === 200) {
    return result.data;
  }
};

const login = async (username, password) => {
  const result = await axiosInstance.post('/auth/login', { username, password });

  if (result.status === 200) {
    return result.data;
  }
};

export { signup, login };
