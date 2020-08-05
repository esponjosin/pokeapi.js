const got = require('got'),
    path = require('path'),
    pError = require(path.resolve(__dirname, './Error.js')),
    Promise = require("bluebird"),
    Utils = new (require(path.resolve(__dirname, '../Utils/Utils.js')));
    
class Ability {

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

        if(self.data) return self.data;

        return new Promise(async (resolve, reject) => {

            if(Utils.findCache(self.name, self.cacheDir)) return resolve(await Utils.getCache(self.name, self.cacheDir))
            
            let body = await got(self.url, { responseType: 'json' }).then(i => i.body).catch(e => false)

            if(!body) return reject(new pError('getInfo Ability', 'Could not get movement information'))

            let info = {
                id: body.id
            }
            
            if(body.names && body.names.findIndex(x => x.language.name == 'en') !== -1) info.name = body.names[body.names.findIndex(x => x.language.name == 'en')].name;
            
            if(body.effect_entries && body.effect_entries.findIndex(x => x.language.name == 'en') !== -1) info.effect = body.effect_entries[body.effect_entries.findIndex(x => x.language.name == 'en')].effect;
                
            if(body.flavor_text_entries && body.flavor_text_entries.findIndex(x => x.language.name == 'en') !== -1) info.flavor_effect = body.flavor_text_entries[body.flavor_text_entries.findIndex(x => x.language.name == 'en')].flavor_text;

            Utils.createCache(self.name, info.id, self.cacheDir, JSON.stringify(info))

            return resolve(info)

        })

    }

}

module.exports = (name, url, dir, data) => new (
    eval(`class ${name.split(' ').join('_').split('-').join('_')} extends Ability {
    constructor(name, url, dir, data) {
        super(name, url, dir, data)
    }
};
${name.split(' ').join('_').split('-').join('_')}`))(name, url, dir, data)