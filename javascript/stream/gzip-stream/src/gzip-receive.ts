/* eslint-disable no-console */
import { createServer } from 'http';
import { createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { basename, join } from 'path';

const server = createServer((req, res) => {
  const xFilename = req.headers['x-filename'];
  if (typeof xFilename !== 'string') {
    throw new Error('Request header field x-filename has invalid value.');
  }
  const filename = basename(xFilename);
  const destFilename = join('received_files', filename);
  console.log(`File request received: ${filename}`);
  req
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'test/plain' });
      res.end('OK\n');
      console.log(`File saved: ${destFilename}`);
    });
});
server.listen(3000, () => console.log('Listening onf http://localhost:3000'));
