const got = require('got'),
    path = require('path'),
    pError = require(path.resolve(__dirname, './Error.js')),
    Promise = require("bluebird"),
    Utils = new (require(path.resolve(__dirname, '../Utils/Utils.js')));
    
class Move {

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

            let res = await got(self.url, { responseType: 'json' }).catch(e => false)

            if(!res) return reject(new pError('getInfo Moves', 'Could not get movement information'))

            let info = {
                id: res.body.id,
                name: Utils.upperFirst(res.body.name),
                accuracy: res.body.accuracy || 0,
                power: res.body.power || 0,
                pp: res.body.pp || 0,
                class: res.body.damage_class.name
            }
            
            if(res.body.target) info.target = res.body.target.name;
            
            if(res.body.effect_entries && res.body.effect_entries.findIndex(x => x.language.name == 'en') !== -1) info.effect = res.body.effect_entries[res.body.effect_entries.findIndex(x => x.language.name == 'en')].effect;
                
            if(res.body.flavor_text_entries && res.body.flavor_text_entries.findIndex(x => x.language.name == 'en') !== -1) info.flavor_effect = res.body.flavor_text_entries[res.body.flavor_text_entries.findIndex(x => x.language.name == 'en')].flavor_text;

            Utils.createCache(self.name, info.id, self.cacheDir, JSON.stringify(info))

            return resolve(info)

        })
    }

}

module.exports = (name, url, dir, data) => new (
    eval(`class ${name.split(' ').join('_').split('-').join('_')} extends Move {
    constructor(name, url, dir, data) {
        super(name, url, dir, data)
    }
};
${name.split(' ').join('_').split('-').join('_')}`))(name, url, dir, data)