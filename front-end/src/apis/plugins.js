import axiosInstance from './axiosConfig';

const getPlugins = async () => {
  const result = await axiosInstance.get('/admin/plugins');

  if (result.status === 200) {
    return result.data;
  }
};

const getPluginCode = async (domainName) => {
  // domainName might be "https://" or something, so we need to filter and take host part only
  const filteredDomainName = domainName.split('/')[2];
  try {
    const result = await axiosInstance.get(`/admin/plugins/${filteredDomainName}`);
    if (result.status === 200) {
      return result.data;
    }
  } catch (error) {
    return null;
  }
};

const addNewPlugin = async (domainName, plugin) => {
  if (!domainName || !plugin) {
    return null;
  }
  const filteredDomainName = domainName.split('/')[2];
  const result = await axiosInstance.post('/admin/plugins/plug', {
    domain_name: filteredDomainName,
    payload: plugin
  });

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

export { getPlugins, addNewPlugin, removePlugin, getPluginCode };
