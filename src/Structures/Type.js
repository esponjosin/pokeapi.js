const got = require('got'),
    path = require('path'),
    pError = require(path.resolve(__dirname, './Error.js')),
    Promise = require("bluebird"),
    Utils = new (require(path.resolve(__dirname, '../Utils/Utils.js')));
    
class Type {

    constructor(name, url, cacheDir, data = false) {        
                
        /**
         * @private
         */
        
        Object.defineProperties(this, {
            "url": {
                value: url,
                writable: false
            },
            "cacheDir": {
                value: cacheDir,
                writable: false
            },
            "name": {
                value: name,
                writable: false
            },
            "data": {
                value: data,
                writable: false
            }
        })
    
    }

    toString() {
        return this.name;
    }
        
    getInfo() {

        let self = this;

        return new Promise(async (resolve, reject) => {

            if(Utils.findCache(self.name, self.cacheDir)) return resolve(await Utils.getCache(self.name, self.cacheDir))
            
            let body = await got(self.url, { responseType: 'json' }).then(i => i.body).catch(e => false)

            if(!body) return reject(new pError('getInfo Type', 'Could not get movement information'))

            let info = {
                id: body.id,
                moves: body.moves.map(x => Utils.upperFirst(x.name).split('-').join(' '))
            }
            
            if(body.names && body.names.findIndex(x => x.language.name == 'en') !== -1) info.name = body.names[body.names.findIndex(x => x.language.name == 'en')].name;
            
            for(var key of Object.keys(body.damage_relations)) {

                info[key] = body.damage_relations[key].map(x => Utils.upperFirst(x.name))

            }

            Utils.createCache(self.name, info.id, self.cacheDir, JSON.stringify(info))

            return resolve(info)

        })
    }

}

module.exports = (name, url, dir, data) => new (
    eval(`class ${name.split(' ').join('_').split('-').join('_')} extends Type {
    constructor(name, url, dir, data) {
        super(name, url, dir, data)
    }
};
${name.split(' ').join('_').split('-').join('_')}`))(name, url, dir, data)