import { promises as fsPromises } from "fs";
import { dirname } from 'path';
import superAgent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils";
import { promisify } from "util";


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
function spiderLinks (currentUrl:string, content:string, nesting:number){
    let promise = Promise.resolve()
    if ( nesting ===0 ){
        return promise
    }
    const links = getPageLinks(currentUrl,content)
    for (const link of links){
        if(!link){
            continue;
        }
        promise = promise.then(()=>spider(link,nesting -1))
    }
}

export function spider(url:string, nesting:number){
    const filename = urlToFilename(url);
    return fsPromises.readFile(filename,'utf8')
        // readFileがrejectされなかった場合は以下のcatch節は無視され、
        // 読み込まれたファイルのコンテンツがそのまま次のthen節に渡される。
        .catch((err)=>{
            if(err.code !== 'ENOENT'){
                throw err
            }
            return download(url, filename)
        })
        .then(content => spiderLinks(url,content,nesting))
}
