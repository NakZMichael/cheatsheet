import { EventEmitter } from 'events'

class Timer extends EventEmitter{
  constructor(){
    super()
  }
  setTimer(timeMs){
    setTimeout(()=>{
      this.emit('timerEvent')
    },timeMs)
  }
}

export const setTimer = (timeMs,cbFn)=>{
  const timer = new Timer()
  timer.setTimer(timeMs)
  return timer.addListener('timerEvent',cbFn)
}
setTimer(1000,()=>{
  console.log('Callback Function')
}).on('timerEvent',()=>{
  console.log('Event Listenr added by on()')
})