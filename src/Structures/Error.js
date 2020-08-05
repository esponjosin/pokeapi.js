class PokeError extends TypeError {

    constructor(method, message) {

        super()

        this.name = 'PokeApi.js Error';

        this.message = `${method} > ${message}`;

    }

}

module.exports = PokeError;