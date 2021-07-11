type Task = ()=>Promise<string>
type Consumer = (value: Task | PromiseLike<Task>) => void

export class TaskQueuePC{
    taskQueue: Task[];
    consumerQueue:Consumer[];
    constructor(concurrency:number){
        this.taskQueue = [];
        this.consumerQueue = [];
        for (let i = 0; i < concurrency; i++){
            // awayt していない
            this.consumer()
        }
    }
    async consumer(){
        while(true){
            try{
                const task = await this.getNextTask();
                await task()
            }catch(err){
                console.error(err)
            }
        }
    }
    async getNextTask(){
        return new Promise<Task>((resolve)=>{
            if(this.taskQueue.length !== 0){
                const task = this.taskQueue.shift() as Task;
                return resolve(task)
            }
            // このPromiseはconsumerQueueの中にプッシュされたresolveが呼び出された時に
            // fullfillする。
            // すなわちそれまでthis.consumer()中の
            // const task = await this.getNextTask()
            // はスリープする。
            this.consumerQueue.push(resolve)
        })
    }

    runTask(task:Task){
        return new Promise((resolve,reject)=>{
            const taskWrapper = ()=>{
                const taskPromise = task();
                taskPromise.then(resolve,reject)
                return taskPromise;
            }
            if(this.consumerQueue.length !== 0){
                const consumer = this.consumerQueue.shift() as Consumer;
                consumer(taskWrapper)
            }else{
                this.taskQueue.push(taskWrapper)
            }
        })
    }
}