import axiosInstance from './axiosConfig';

const NOVEL_SERVICE_URL = 'http://localhost:3000/api/v1';

const getNovels = async (offset) => {
  const result = await axiosInstance.get(`${NOVEL_SERVICE_URL}/novels${offset ? `?offset=${offset}` : ''}`);
  if (result.status === 200) {
    return result.data;
  }
};

const getNovelDetail = async (novelId, supplier) => {
  const result = await axiosInstance.get(
    `${NOVEL_SERVICE_URL}/novels/detail/${novelId}${supplier ? `?domain_name=${supplier}` : ''}`
  );
  if (result.status === 200) {
    return result.data;
  }
};

const getRecentNovels = async () => {
  const result = await axiosInstance.get(`${NOVEL_SERVICE_URL}/u/recent`);
  if (result.status === 200) {
    return result.data;
  }
};

const getChapterContent = async (novelId, chapterId, supplier) => {
  const result = await axiosInstance.get(
    `${NOVEL_SERVICE_URL}/novels/detail/${novelId}/${chapterId}${supplier ? `?domain_name=${supplier}` : ''}`
  );
  if (result.status === 200) {
    return result.data;
  }
};

export { getNovels, getNovelDetail, getRecentNovels, getChapterContent };
