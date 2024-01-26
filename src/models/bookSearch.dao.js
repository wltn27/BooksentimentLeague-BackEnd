import request from 'request-promise-native';
const client_id = 'bRYYdH5dMBrr9qKTkhmp';
const client_secret = 'v4BPXILjXE';

export const earchBooks = async(query) => {
  const api_url = `https://localhost/v1/search/book.json?query=${encodeURI(query)}`;

  const options = {
    url: api_url,
    headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret },
  };

  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    };
  });
};