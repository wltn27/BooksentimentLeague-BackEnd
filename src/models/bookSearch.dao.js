// bookSearch.dao.js
import request from 'request-promise-native';

const client_id = 'bRYYdH5dMBrr9qKTkhmp';
const client_secret = 'v4BPXILjXE';

const searchBooks = async (query) => {
  const api_url = `https://localhost/v1/search/book.json?query=${encodeURI(query)}`;

  const options = {
    url: api_url,
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret },
  };

  try {
    const body = await request.get(options);
    return JSON.parse(body);
  } catch (error) {
    console.error('Error in searchBooks:', error);
    throw error;
  }
};

export { searchBooks };
