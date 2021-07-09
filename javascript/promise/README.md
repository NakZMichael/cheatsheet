## Promise.all()

`Promise.all(promises:Promise[])`を使うと全てのPromiseを同時に実行することができる。
また、一つでもPromiseがrejectされたならその瞬間に`Promise.all()`もrejectとなる。

## 起動コマンド

具体例

```
yarn start  https://loige.co 2
```