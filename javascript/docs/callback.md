# 同期関数を非同期にしたいときは

```javascript
process.nextTick(() => callback(cache.get(filename)))
```

のようにすると便利

# コールバックに関するconvention

- コールバック関数を引数にとるときは最後にする
  - 無名関数を使うときに便利だから。
- コールバック関数の引数は最初をerrorにする
  - まあ、規約っぽい

```javascript
readFile('foo.txt', 'utf8', (err, data) => {
  if(err) {
    handleError(err)
  } else {
    processData(data)
  }
})
```
