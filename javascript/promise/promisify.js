import { randomBytes } from 'crypto'

/**
 * CallbackベースのAPIを持つ非同期関数からPromiseを返す関数を作成する。
 * 
 * 実際の開発ではNode.jsのcoreライブラリのpromisify関数を使うと良い。
 */
function promisify (callbackBasedApi) {

    return function promisified (...args) {

        return new Promise((resolve, reject) => { 
            const newArgs = [
                ...args,
                // callback関数としてrejectとresolveを使う関数を作成する。
                // Node.js-style callback-based関数はcallback関数を最後の引数に取る。
                function (err, result) {
                    if (err) {
                        return reject(err)
                    }
                    resolve(result)
                }
            ]
            // promisifyの引数に取ったNode.js-style callback-based関数を呼び出す。
            callbackBasedApi(...newArgs)
        })
    }
}

// randomBytes()はこんなAPIを持っている
randomBytes(32,(err,buf)=>{
    console.log(`randomBytes()はこういう出力をする: ${buf}`)
})

const randomBytesP = promisify(randomBytes)

randomBytesP(32)
    .then(buffer => {
        console.log(`Random bytes: ${buffer.toString()}`)
    })
