import axiosInstance from './axiosConfig';

const getPlugins = async () => {
  const result = await axiosInstance.get('/admin/plugins/supplier');

  if (result.status === 200) {
    return result.data;
  }
};

const getPluginsOrder = async () => {
  const result = await axiosInstance.get('/u/preference');

  if (result.status === 200) {
    return result.data;
  }
};

const updatePluginsOrder = async (suppliers) => {
  const result = await axiosInstance.post('/u/preference', {
    domain_names: suppliers
  });
  if (result.status === 200) {
    return result.data;
  }
};

const getPluginCode = async (domainName) => {
  // domainName might be "https://" or something, so we need to filter and take host part only
  try {
    const result = await axiosInstance.get(`/admin/plugins/supplier/${domainName}`);
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
  const result = await axiosInstance.post('/admin/plugins/supplier', {
    domain_name: filteredDomainName,
    payload: plugin
  });

  if (result.status === 200) {
    return result.data;
  }
};

const removePlugin = async (domainName) => {
  const result = await axiosInstance.delete(`/admin/plugins/supplier/${domainName}`);

  if (result.status === 200) {
    return result.data;
  }
};

export { getPlugins, addNewPlugin, removePlugin, getPluginCode, getPluginsOrder, updatePluginsOrder };
