import { promises as fsPromises } from "fs";
import { dirname } from 'path';
import superAgent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils";
import { promisify } from "util";
import { TaskQueue } from "./taskQueue";


const mkdirpPromises = promisify<string,undefined>(mkdirp)

/**
 * この関数は既知の数だけ順番に非同期関数を実行する場合の具体例になっている。
 * @param url 
 * @param filename 
 * @returns 
 */
export function download (url:string, filename:string) {
    console.log(`Downloading ${url}`)
    let content:string;
    return superAgent.get(url)
        .then((res)=>{
            content = res.text;
            return mkdirpPromises(dirname(filename),undefined)
        })
        .then(()=> fsPromises.writeFile(filename,content))
        .then(()=>{
            console.log(`Downloaded and saved: ${url}`)
            return content;
        })
}

/**
 * この関数は長さのわからないsequential iterationの具体例になっている。
 * @param currentUrl 
 * @param content 
 * @param nesting 
 * @returns 
 */
function spiderLinks (currentUrl:string, content:string, nesting:number, queue:TaskQueue){
    if ( nesting ===0 ){
        return Promise.resolve()
    }
    const links = getPageLinks(currentUrl,content)
    const promises = links.map(link => spiderTask(link?link:'', nesting -1 ,queue))
    // 同時に実行する非同期処理の数を管理するのはTaskQueueの役割なのでここではPromise.allを使っても良い
    return Promise.all(promises)
}

const spidering = new Set();

function spiderTask(url:string,nesting:number,queue:TaskQueue){
    if(spidering.has(url)){
        return Promise.resolve()
    }
    spidering.add(url)
    const filename = urlToFilename(url)
    return queue.runTask(()=>{
        return fsPromises.readFile(filename,'utf8')
            .catch((err)=>{
                if(err.code !== 'ENOENT'){
                    throw err
                }
                return download(url,filename)
            })
    })
    .then(content => {
        if(typeof content === 'string'){
            spiderLinks(url,content,nesting,queue)
        }
    })
}

export function spider(url:string, nesting:number,concurrency:number){
    const queue = new TaskQueue(concurrency)
    return spiderTask(url,nesting,queue)
}
