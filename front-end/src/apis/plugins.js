import axiosInstance from './axiosConfig';

const getPlugins = async () => {
  const result = await axiosInstance.get('/admin/plugins');

  if (result.status === 200) {
    return result.data;
  }
};

const addNewPlugin = async (plugin) => {
  const result = await axiosInstance.post('/admin/plugins/plug', plugin);

  if (result.status === 200) {
    return result.data;
  }
};

const removePlugin = async (domainName) => {
  const result = await axiosInstance.delete(`/admin/plugins/unplug/${domainName}`);

  if (result.status === 200) {
    return result.data;
  }
};

export { getPlugins, addNewPlugin, removePlugin };
