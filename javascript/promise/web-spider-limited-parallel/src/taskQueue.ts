export class TaskQueue{
  concurrency:number;
  running:number;
  queue:(()=>Promise<any>)[]
  constructor(concurrency:number){
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = []
  }

  runTask(task:()=>Promise<any>){
    return new Promise((resolve,reject)=>{
      this.queue.push(()=>{
        return task().then(resolve,reject)
      })
      process.nextTick(this.next.bind(this))
    })
  }

  next(){
    while (this.running < this.concurrency && this.queue.length){
      const task = this.queue.shift()
      if(!task){
        continue;
      }
      task()
      // タスクが完了したらrunningを一つ減らし、next()を呼び出す。
        .finally(()=>{
          this.running--;
          this.next();
        })
      this.running++
    }
  }
}