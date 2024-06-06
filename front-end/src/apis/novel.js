import axios from 'axios';

const NOVEL_SERVICE_URL = 'http://localhost:3000/api/v1';

const getNovels = async () => {
  const result = await axios.get(`${NOVEL_SERVICE_URL}/novels`);
  if (result.status === 200) {
    return result.data;
  }
};

const getNovelDetail = async (novelId) => {
  const result = await axios.get(`${NOVEL_SERVICE_URL}/${novelId}/detail`);
  if (result.status === 200) {
    return result.data;
  }
};

const getRecentNovels = async (userId) => {
  const result = await axios.get(`${NOVEL_SERVICE_URL}/recent/${userId}`);
  if (result.status === 200) {
    return result.data;
  }
};

const getChapterContent = async (novelId, chapterId) => {
  const result = await axios.get(`${NOVEL_SERVICE_URL}/detail/${novelId}/${chapterId}`);
  console.log('result');
  console.log(result);
  if (result.status === 200) {
    return result.data;
  }
};

export { getNovels, getNovelDetail, getRecentNovels, getChapterContent };
