import { promises as fsPromises } from "fs";
import { dirname } from 'path';
import superAgent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils";
import { promisify } from "util";
import { TaskQueuePC } from "./taskQueuePC";


const mkdirpPromises = promisify<string,undefined>(mkdirp)

/**
 * この関数は既知の数だけ順番に非同期関数を実行する場合の具体例になっている。
 * @param url 
 * @param filename 
 * @returns 
 */
export async function download (url:string, filename:string) {
    console.log(`Downloading ${url}`)
    let {text : content} = await superAgent.get(url)
    await mkdirpPromises(dirname(filename),undefined)
    if(!content){
        content = ''
    }
    await fsPromises.writeFile(filename, content)
    console.log(`Downloaded and saved: ${url}`)
    return content
        
}

/**
 * この関数は長さのわからないsequential iterationの具体例になっている。
 * @param currentUrl 
 * @param content 
 * @param nesting 
 * @returns 
 */
async function spiderLinks (currentUrl:string, content:string, nesting:number, queue:TaskQueuePC){
    if ( nesting ===0 ){
        return Promise.resolve()
    }
    const links = getPageLinks(currentUrl,content)
    const promises = links.map(link => spiderTask(link?link:'', nesting -1 ,queue))
    // 同時に実行する非同期処理の数を管理するのはTaskQueueの役割なのでここではPromise.allを使っても良い
    try{
        return await Promise.all(promises)
    }catch(err){
        throw new Error('Bad Error')
    }
}

const spidering = new Set();

async function spiderTask(url:string,nesting:number,queue:TaskQueuePC){
    if(spidering.has(url)){
        return Promise.resolve()
    }
    spidering.add(url)
    const filename = urlToFilename(url)
    const content = await queue.runTask(async ()=>{
        try {
            return await fsPromises.readFile(filename, 'utf8');
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }
            return await download(url, filename);
        }
    })
    if(typeof content === 'string'){
        await spiderLinks(url,content,nesting,queue)
    }

}

export async function spider(url:string, nesting:number,concurrency:number){
    const queue = new TaskQueuePC(concurrency)
    return await spiderTask(url,nesting,queue)
}

