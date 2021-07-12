import { request, RequestOptions } from 'http';
import { basename } from 'path';
import { createReadStream } from 'fs';
import { createGzip } from 'zlib';

const filename = process.argv[2];
const serverHost = process.argv[3];
const httpRequestOptions:RequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(filename),
  },
};
const req = request(httpRequestOptions, (res) => {
  console.log(`Server response: ${res.statusCode}`);
});

createReadStream(filename)
  .pipe(createGzip())
  .pipe(req)
  .on('finish', () => {
    console.log('File successfully sent');
  });
