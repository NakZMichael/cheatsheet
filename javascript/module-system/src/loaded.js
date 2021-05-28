// const dependency = require('./anotherModule')
const dependency = {
  username:'foo bar'
}
// a private function
function log() {
  console.log(`Well done ${dependency.username}`)
}
// the API to be exported for public use
module.exports.run = () => {
  log()
}

// function hoge(a,b){
//   b = {} //ってすると関数内のbの参照が切り替わる。(代入されたbの値が書き換わるわけではない。)
//   //       JavaScriptでは関数に代入された時値はコピーが渡される。なので意味がない。
//   a.baz = {} // aそのものは代入先がコピーされたものだが、a.bazは元のaと同じ参照を指しているので値が書き換わる。
// }

// let a = {
//   foo:'bar',
//   baz:{
//     x:'y'
//   }
// }

// hoge(a,a.baz)

// console.log(a)

// function add(x){
//   x++
//   console.log(x)
// }

// let x =1
// add(x)
// console.log(x)