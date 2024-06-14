import axiosInstance from './axiosConfig';

const getNovels = async (offset, searchTerm, fromType) => {
  const result = await axiosInstance.get(
    `/novels?offset=${offset && (!searchTerm || searchTerm == '') ? offset * 20 : '0'}${fromType ? `&${fromType}=${searchTerm}` : ''}`
  );
  if (result.status === 200) {
    return result.data;
  }
};

const getNovelDetail = async (novelId, supplier) => {
  const result = await axiosInstance.get(`/novels/detail/${novelId}${supplier ? `?domain_name=${supplier}` : ''}`);
  if (result.status === 200) {
    return result.data;
  }
};

const getRecentNovels = async () => {
  const result = await axiosInstance.get(`/u/recent`);
  if (result.status === 200) {
    return result.data;
  }
};

const getChapterContent = async (novelId, chapterId, supplier) => {
  const result = await axiosInstance.get(
    `/novels/detail/${novelId}/${chapterId}${supplier ? `?domain_name=${supplier}` : ''}`
  );
  if (result.status === 200) {
    return result.data;
  }
};

export { getNovels, getNovelDetail, getRecentNovels, getChapterContent };
