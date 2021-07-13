import {createServer} from 'http';
import Chance from 'chance';

const chance = new Chance();

const server = createServer((req, res)=>{
  res.writeHead(200, {'Content-Type': 'text/plain'});
  function generateMore() {
    //   95%の確率でtrueを返す。
    while (chance.bool({likelihood: 95})) {
      // デフォルトのhighWaterMarkをギリギリ超えない長さのランダムな文字列を生成する
      // highWaterMarkとはstreamの内部で使われているBufferに入れられるサイズのこと
      const randomChunk = chance.string({
        length: (16*1024)-1,
      });
      // highWaterMarkを超えるとres.write()はfalseを返す。
      const shouldContinue = res.write(`${randomChunk}\n`);
      if (!shouldContinue) {
        console.log('back-pressure');
        // streamのBufferが空になるとdrainシグナルが出る
        // drainシグナルをキャッチすると再起的に関数を再開するようにリスナーを登録する。
        // このようなメカニズムをbackpressureと呼ぶ
        res.once('drain', generateMore);
        return;
      }
    }
    res.end('\n\n');
  }
  generateMore();
  res.on('finish', ()=>console.log('All data sent'));
});

server.listen(8080, ()=>{
  console.log('listening on http://localhost:8080');
});

