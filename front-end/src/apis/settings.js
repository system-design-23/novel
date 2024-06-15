import axiosInstance from './axiosConfig';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const getPreference = async () => {
  const result = await axiosInstance.get('/u/setting');

  if (result.status === 200) {
    return result.data;
  }
};

const updateCurrentPreference = async (preference) => {
  const result = await axiosInstance.post('/u/setting', preference);

  if (result.status === 200) {
    return result.data;
  }
};

export { getPreference, updateCurrentPreference };
