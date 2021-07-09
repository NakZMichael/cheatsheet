/**
 * constructorを使ったPromiseインスタンスの作例　
 */


/**
 * 
 * @param {number} milliseconds 遅れる秒数 
 * @returns { Promise<Date> } 実行時の時刻+milliseconds
 */
function delay (milliseconds){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(new Date())
        }, milliseconds)
    })
}

console.log(`Delaying... ${new Date().toLocaleTimeString()}`)
delay(2000).then((value)=>console.log(`Done ${value.toLocaleTimeString()}`))