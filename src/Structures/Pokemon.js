const path = require('path'),
    Utils = new (require(path.resolve(__dirname, '../Utils/Utils.js'))),
    Ability = require(path.resolve(__dirname, './Ability.js')),
    Type = require(path.resolve(__dirname, './Type.js')),
    Move = require(path.resolve(__dirname, './Moves.js'));

class Pokemon {

    constructor(name, data, self) {
        
        /**
         * @private
         */

        Object.defineProperties(this, {
            "data": {
                value: data,
                writable: false
            },
            "self": {
                value: self,
                writable: false
            },
            "name": {
                value: name,
                writable: false
            }
        })

    }
    
    toString() {
        return this.data.name
    }
    
    getID() {
        return this.data.id
    }

    getSprites() {
        return this.data.sprites;
    }

    getMoves() {
        
        let dir = this.self.movesPath

        return this.data.moves.map(x => Move(Utils.upperFirst(x.name.split('-').join(' ')), x.url, dir))

    }
    
    getAbilities() {
        let dir = this.self.abilitiesPath
        return this.data.abilities.map(x => Ability(Utils.upperFirst(x.name.split('-').join(' ')), x.url, dir))
    }
    
    getTypes() {
        let dir = this.self.typesPath
        return this.data.types.map(x => Type(Utils.upperFirst(x.name.split('-').join(' ')), x.url, dir))
    }

}

module.exports = (name, data, self) => new (eval(`class ${name.split(' ').join('_').split('-').join('_')} extends Pokemon {
    constructor(name, data, self) {
        super(name, data, self)
    }
};
${name.split(' ').join('_').split('-').join('_')}`))(name, data, self)