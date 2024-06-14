import axiosInstance from './axiosConfig';

const getFormats = async () => {
  const result = await axiosInstance.get('/export');

  if (result.status === 200) {
    return result.data;
  }
};

const getFormatCode = async (formatName) => {
  try {
    const result = await axiosInstance.get(`/admin/plugins/format/${formatName}`);
    if (result.status === 200) {
      return result.data;
    }
  } catch (error) {
    return null;
  }
};

const addNewFormat = async (formatName, dependency, plugin) => {
  if (!formatName || !dependency || !plugin) {
    return null;
  }

  const result = await axiosInstance.post('/admin/plugins/format', {
    format_name: formatName,
    dependency: dependency,
    payload: plugin
  });

  if (result.status === 200) {
    return result.data;
  }
};

const removeFormat = async (exportFormat) => {
  const result = await axiosInstance.delete(`/admin/plugins/format/${exportFormat}`);

  if (result.status === 200) {
    return result.data;
  }
};

const exportByFormat = async (formatName, chapterId, domain) => {
  const result = await axiosInstance.post(`/export`, {
    file_format: formatName,
    chapterId: chapterId,
    supplier: domain
  });

  if (result.status === 200) {
    return result.data;
  }
};

const downloadTempfile = async (tempfile) => {
  let tempWin = window.open('', '_blank');

  let link = document.createElement('a');
  link.href = import.meta.env.VITE_SERVER_URL + '/export/download?tempfile=' + tempfile;
  tempWin.document.body.appendChild(link);
  link.click();
  let cnt_focus = 0;
  tempWin.addEventListener('focus', () => {
    if (++cnt_focus == 3) {
      tempWin.close();
    }
  });
};

export { getFormats, getFormatCode, addNewFormat, removeFormat, exportByFormat, downloadTempfile };
