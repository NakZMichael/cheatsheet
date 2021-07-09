## Callbackに対するPromiseの利点

- 以下のように簡潔に書ける。
  - rejectとfululilledの場合をcallback関数の中で場合分けせずに済む

```javascript
// Promiseを用いた場合
asyncOperationPromise(arg)
  .then(result => {
    // do stuff with result
  }, err => {
    // handle the error
  })

// Callbackを用いた場合
asyncOperation(arg, (err, result) => {
  if(err) {
    // handle the error
  }
  // do stuff with the result
})

```

- Promiseが同期的な場合もonFulfilled()およびonRejected()コールバックは非同期的に、多くても1回しか起動しないことが保証されている。それだけでなく、then()が呼ばれた瞬間にPromiseオブジェクトがすでにresolveされていても、onFulfilled()とonRejected()コールバックは非同期的に呼び出されます。この動作は、余分な労力をかけずに非同期コードの一貫性と堅牢性を高めてくれる。
- Promeiseの中でthrowされた例外はonRejected()に渡されるのでCPSと違って通常のthrow構文が使える。

## Promiseの細かい仕様

- `resolve`や`reject`をコンストラクタ中で何度か呼び出しても最初に呼び出された値のみがPromiseをfulufilmentかrejectionになる。