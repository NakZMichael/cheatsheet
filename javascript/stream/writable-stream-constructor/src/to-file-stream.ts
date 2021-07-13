import { Writable, WritableOptions } from 'stream';
import { promises as fs } from 'fs';
import { dirname } from 'path';

interface ToFileStreamChunk{
  path:string
  content:string
}

export class ToFileStream extends Writable {
  constructor(options?:WritableOptions) {
    super({ ...options, objectMode: true });
  }

  override async _write(chunk:ToFileStreamChunk, encoding:string, cb:Function) {
    try {
      try {
        await fs.mkdir(dirname(chunk.path));
      } catch (err:any) {
        if (err.code !== 'EEXIST') {
          throw err;
        }
      }
      await fs.writeFile(chunk.path, chunk.content);
      await cb();
    } catch (err) {
      cb(err);
    }
  }
}
