import { join } from 'path';
import { ToFileStream } from './to-file-stream';

const tfs = new ToFileStream();
tfs.write({ path: join('files', 'file1.txt'), content: 'Hello' }, (err) => {
  console.log(err);
});
tfs.write({ path: join('files', 'file2.txt'), content: 'Node.js' });
tfs.write({ path: join('files', 'file3.txt'), content: 'streams' });
tfs.end(() => console.log('All files created'));
tfs.on('error', (err) => {
  console.log('An error has been occurred');
  console.log(err);
});
