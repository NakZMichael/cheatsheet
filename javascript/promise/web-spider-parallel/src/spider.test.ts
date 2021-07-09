import { download } from "./spider"
import fs from 'fs/promises'

describe('Test download()',()=>{
    describe('it should download the html of the given url',()=>{
        test(`if the url given is http://example.com/, then a download process should succeed`,async ()=>{
            const filename = './testAssets/example.com.html'
            const exampleHTML = await download('http://example.com/',filename)
            await fs.unlink(filename)
            console.log(exampleHTML)
        })
    })
})