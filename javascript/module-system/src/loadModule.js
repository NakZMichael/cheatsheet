const fs = require('fs')

function loadModule (filename, module, require_) {
  const wrappedSrc =
    `(function (module, exports, require_) {
      ${fs.readFileSync(filename, 'utf8')}
    })(module, module.exports, require_)`
  eval(wrappedSrc)
}

function require_ (moduleName) {
  console.log(`require_ invoke for module: ${moduleName}`)
  // require_.resolveがmodule名のフルパスを取得する。
  const id = require_.resolve(moduleName)
  if(require_.cache[id]){
    // 既に取得されているならcacheに保存されているはずなのですぐにリターンする
    return require_.cache[id].exports
  }
  const module = {
    exports:{},
    id
  }
  require_.cache[id] = module
  loadModule(id,module,require_)
  return module.exports
}

require_.cache = {}
require_.resolve = (moduleName) => {
  // module名のフルパスを取得する
  return __dirname +'/'+ moduleName
}

const loaded =  require_('loaded.js')
loaded.run()

