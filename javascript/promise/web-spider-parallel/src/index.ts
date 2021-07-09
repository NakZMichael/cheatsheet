import { spider } from "./spider";

const url = process.argv[2]
const nesting = Number.parseInt(process.argv[3], 10) || 1
console.log('Downloading...')
spider(url,nesting)
    .then(()=>console.log('Download complete'))
    .catch(err => console.error(err))