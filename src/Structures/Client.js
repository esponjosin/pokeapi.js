const got = require('got'),
    path = require('path'),
    { existsSync, mkdirSync, readdirSync, lstatSync, unlinkSync } = require('fs'),
    pError = require(path.resolve(__dirname, './Error.js')),
    Pokemon = require(path.resolve(__dirname, './Pokemon.js')),
    Utils = new (require(path.resolve(__dirname, '../Utils/Utils.js'))),
    Ability = require(path.resolve(__dirname, './Ability.js')),
    Type = require(path.resolve(__dirname, './Type.js')),
    Move = require(path.resolve(__dirname, './Moves.js')),
    Promise = require("bluebird"),
    api = 'https://pokeapi.co/api/v2/';

/**
 * Client for pokeapi.co Wraper
 */

class PokeApiClient {

    /**
     * @param {string} cachePath Base path where the cache will be stored
     */

    constructor(cachePath, debug = false) {

        /*
        * Checking that they enter the path and that the path is a string
        */

        if(!cachePath) throw new pError('constructor', 'The path where the cache was stored was not entered');
        if(typeof cachePath !== 'string') throw new pError('constructor', 'The path you enter is not a string');

        if(!existsSync(cachePath)) throw new pError('constructor', 'The entered path does not belong to any created folder')
        else if(existsSync(cachePath) && !Utils.checkDir(cachePath)) throw new pError('constructor', 'The entered path belongs to a file because I cannot create the folder I need')

        cachePath = path.resolve(cachePath, './pokeapi')

        /*
        * We check and create the root folder and the subfolders
        */

        if(!existsSync(cachePath)) mkdirSync(cachePath);
        else if(existsSync(cachePath) && !Utils.checkDir(cachePath)) throw new pError('constructor', 'There is already a file called pokeapi so the directory where the cache will be stored cannot be created')

        let cacheMoves = path.resolve(cachePath, './moves/')
        if(!existsSync(cacheMoves)) mkdirSync(cacheMoves);

        let cachePokemons = path.resolve(cachePath, './pokemons/')
        if(!existsSync(cachePokemons)) mkdirSync(cachePokemons);
        
        let cacheAbilitites = path.resolve(cachePath, './abilities/')
        if(!existsSync(cacheAbilitites)) mkdirSync(cacheAbilitites);
        
        let typesPath = path.resolve(cachePath, './types/')
        if(!existsSync(typesPath)) mkdirSync(typesPath);
        
        /**
         * Client options
         * @private
         */

        Object.defineProperties(this, {
            "pokemonsPath": {
                value: cachePokemons,
                writable: false
            },
            "movesPath": {
                value: cacheMoves,
                writable: false
            },
            "abilitiesPath": {
                value: cacheAbilitites,
                writable: false
            },
            "typesPath": {
                value: typesPath,
                writable: false
            },
            "debug": {
                value: debug,
                writable: false
            }
        })

        this.clearCache();

    }
    
    findMove(move) {

        let self = this;

        return new Promise(async (resolve, reject) => {

            if(Utils.findCache(move, self.movesPath)) {
                let cache = Utils.getCache(move, self.movesPath)
                return resolve(Move(Utils.upperFirst(cache.name), `${api}/move/${move}`, self.movesPath, cache))
            }
            
            let body = await got(`${api}/move/${move}`, { responseType: 'json' }).then(i => i.body).catch(e => false)

            if(!body) return reject(new pError('find', `Could not find any move with the ${!isNaN(move) ? `id ${move}` : `name ${move}`}`))

            let info = {
                id: body.id,
                name: Utils.upperFirst(body.name),
                accuracy: body.accuracy || 0,
                power: body.power || 0,
                pp: body.pp || 0,
                class: body.damage_class.name
            }
            
            if(body.target) info.target = body.target.name;
            
            if(body.effect_entries && body.effect_entries.findIndex(x => x.language.name == 'en') !== -1) info.effect = body.effect_entries[body.effect_entries.findIndex(x => x.language.name == 'en')].effect;
                
            if(body.flavor_text_entries && body.flavor_text_entries.findIndex(x => x.language.name == 'en') !== -1) info.flavor_effect = body.flavor_text_entries[body.flavor_text_entries.findIndex(x => x.language.name == 'en')].flavor_text;

            Utils.createCache(info.name, info.id, self.movesPath, JSON.stringify(info))

            return resolve(Move(info.name, `${api}/move/${move}`, self.movesPath, info))

        })

    }
    
    findType(type) {

        let self = this;

        return new Promise(async (resolve, reject) => {

            if(Utils.findCache(type, self.typesPath)) {
                let cache = Utils.getCache(type, self.typesPath)
                return resolve(Type(Utils.upperFirst(cache.name), `${api}/type/${type}`, self.typesPath, cache))
            }
            
            let body = await got(`${api}/type/${type}`, { responseType: 'json' }).then(i => i.body).catch(e => false)

            if(!body) return reject(new pError('find', `Could not find any type with the ${!isNaN(type) ? `id ${type}` : `name ${type}`}`))

            let info = {
                id: body.id,
                moves: body.moves.map(x => Utils.upperFirst(x.name).split('-').join(' '))
            }
            
            if(body.names && body.names.findIndex(x => x.language.name == 'en') !== -1) info.name = body.names[body.names.findIndex(x => x.language.name == 'en')].name;
            
            for(var key of Object.keys(body.damage_relations)) {

                info[key] = body.damage_relations[key].map(x => Utils.upperFirst(x.name))

            }

            Utils.createCache(info.name, info.id, self.typesPath, JSON.stringify(info))

            return resolve(Ability(info.name, `${api}/type/${type}`, self.typesPath, info))

        })

    }
    
    findAbility(ability) {

        let self = this;

        return new Promise(async (resolve, reject) => {

            if(Utils.findCache(ability, self.abilitiesPath)) {
                let cache = Utils.getCache(ability, self.abilitiesPath)
                return resolve(Ability(Utils.upperFirst(cache.name), `${api}/ability/${ability}`, self.abilitiesPath, cache))
            }
            
            let body = await got(`${api}/ability/${ability}`, { responseType: 'json' }).then(i => i.body).catch(e => false)

            if(!body) return reject(new pError('find', `Could not find any ability with the ${!isNaN(ability) ? `id ${ability}` : `name ${ability}`}`))

            let info = {
                id: body.id
            }
            
            if(body.names && body.names.findIndex(x => x.language.name == 'en') !== -1) info.name = body.names[body.names.findIndex(x => x.language.name == 'en')].name;
            
            if(body.effect_entries && body.effect_entries.findIndex(x => x.language.name == 'en') !== -1) info.effect = body.effect_entries[body.effect_entries.findIndex(x => x.language.name == 'en')].effect;
                
            if(body.flavor_text_entries && body.flavor_text_entries.findIndex(x => x.language.name == 'en') !== -1) info.flavor_effect = body.flavor_text_entries[body.flavor_text_entries.findIndex(x => x.language.name == 'en')].flavor_text;

            Utils.createCache(info.name, info.id, self.abilitiesPath, JSON.stringify(info))

            return resolve(Ability(info.name, `${api}/ability/${ability}`, self.abilitiesPath, info))

        })

    }

    findPoke(poke) {

        let self = this;

        return new Promise(async (resolve, reject) => {

            if(Utils.findCache(poke, self.pokemonsPath)) {
                let cache = Utils.getCache(poke, self.pokemonsPath)
                return resolve(Pokemon(Utils.upperFirst(cache.name), cache, self))
            }

            let body = await got(`${api}/pokemon/${poke}`, { responseType: 'json' }).then(i => i.body).catch(e => false)

            if(!body) return reject(new pError('find', `Could not find any pokemon with the ${!isNaN(poke) ? `id ${poke}` : `name ${poke}`}`))

            let sprites = Object.assign(body.sprites.versions, body.sprites);
            delete sprites.versions;

            let data = {
                id: body.id,
                name: Utils.upperFirst(body.name),
                height: body.height,
                weight: body.weight,
                types: body.types.map(x => new Object({ name: x.type.name, url: x.type.url })),
                sprites: sprites,
                abilities: body.abilities.map(x => new Object({ name: x.ability.name, url: x.ability.url })),
                stats: body.stats.map(x => new Object({ base: x.base_stat, name: x.stat.name })),
                moves: body.moves.map(x => new Object({ name: x.move.name, url: x.move.url })),
                types: body.types.map(x => new Object({ name: x.type.name, url: x.type.url }))
            }
            
            Utils.createCache(data.name, data.id, self.pokemonsPath, JSON.stringify(data))

            return resolve(Pokemon(Utils.upperFirst(data.name), data, self))

        })

    }

    async clearCache() {

        let self = this;
        
        await Promise.all([
            self.deleteCache(self.pokemonsPath).then(i => i),
            self.deleteCache(self.abilitiesPath).then(i => i),
            self.deleteCache(self.typesPath).then(i => i),
            self.deleteCache(self.movesPath).then(i => i)
        ])
        
        await Utils.wait(1.8e+6)

        self.clearCache();

    }

    deleteCache(dir) {
        return new Promise(async (resolve, reject) => {

            let files = readdirSync(dir)
            .filter(x => Date.now() - lstatSync(path.resolve(dir, x)).atime > 8.64e+7)

            for(var file of files) {
                
                unlinkSync(path.resolve(dir, file))

                if(self.debug) console.log(`Deleting file ${file} of ${dir}`)

            }
            
            resolve(files)

        })
    }

}

module.exports = PokeApiClient;