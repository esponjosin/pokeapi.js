## PokeApi.js

```
npm i pokeapi.js
```


## Info

```js
/**
 * @param {string} [dir] Ruta donde se almacenara el cache
 */

const PokeClient = new (require('pokeapi.js'))(dir)
```

# findPoke

```js
/**
 * @param {string/number} [poke] Nombre o id del pokemon que se buscara
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findPoke('1')

/**
Devuelve una promesa que retorna
{<Pokemon> class}
 */
```

# findMove

```js
/**
 * @param {string/number} [move] Nombre o id del movimiento que se buscara
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findMove('1')

/**
Devuelve una promesa que retorna
{<Move> class}
 */
```

# findType

```js
/**
 * @param {string/number} [type] Nombre o id del tipo que se buscara
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findType('1')

/**
Devuelve una promesa que retorna
{<Type> class}
 */
```

# findAbility

```js
/**
 * @param {string/number} [ability] Nombre o id de la habilidad que se buscara
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findAbility('1')

/**
Devuelve una promesa que retorna
{<Ability> class}
 */
```

## Bot de muestra con discord.jss

```js
const Discord = require('discord.js');
const PokeClient = new (require('pokeapi.js'))(__dirname)
 
const client = new Discord.Client();
 
const settings = {
  prefix: '!',
  token: 'TUTOKEN'
}
 
client.on('message', async message => {
 
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  var args = message.content.split(' ').slice(1);
 
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'pokemon') {
      
      if(!args[0]) return message.channel.send(':x: | Necesitas ingresar el nombre o la id del pokemon que quieres buscar')

      let Pokemon = await PokeClient.findPoke(args[0]).catch(e => false)

      if(!Pokemon) return message.channel.send(':x: | No se encontro el pokemon')

      let moves = Pokemon.getMoves()
      let abilities = Pokemon.getAbilities()
      let types = Pokemon.getTypes()

      message.channel.send(`**${Pokemon.getID()}** ${Pokemon}
Movimientos: ${moves.map(x => `\`${x}\``).join(', ')}
Habilidades: ${abilities.map(x => `\`${x}\``).join(', ')}
Tipos: ${types.map(x => `\`${x}\``).join(', ')}`)

  }
  else if(command == 'move') {

    if(!args[0]) return message.channel.send(':x: | Necesitas ingresar el nombre o la id del movimiento que quieres buscar')

    let Move = await PokeClient.findMove(args[0]).catch(e => false)

    if(!Move) return message.channel.send(':x: | El movimiento no se encontro')

    let info = await Move.getInfo()
    
    message.channel.send(`**${info.id}** ${info.name}
Exactitud: \`${info.accuracy || 0}\`
Poder: \`${info.power || 0}\`
PP: \`${info.pp || 0}\`
Clase: \`${info.class || 'Nada'}\`
Objetivo: \`${info.target || 'Nada'}\`
Efecto: \`${info.effect || 'Nada'}\`
Flavor effect: \`${info.flavor_effect || 'Nada'}\``)

  }
  else if(command == 'ability') {

    if(!args[0]) return message.channel.send(':x: | Necesitas ingresar el nombre o la id de la habilidad que quieres buscar')

    let Ability = await PokeClient.findAbility(args[0]).catch(e => false)

    if(!Ability) return message.channel.send(':x: | No se encontro la habilidad')

    let info = await Ability.getInfo()
    
    message.channel.send(`**${info.id}** ${info.name}
Exactitud: \`${info.accuracy || 0}\`
Efecto: \`${info.effect || 'Nada'}\`
Flavor effect: \`${info.flavor_effect || 'Nada'}\``)

  }
  else if(command == 'type') {

    if(!args[0]) return message.channel.send(':x: | Necesitas ingresar el nombre o la id del tipo que quieres buscar')

    let Type = await PokeClient.findType(args[0]).catch(e => false)

    if(!Type) return message.channel.send(':x: | No se encontro el tipo')

    let info = await Type.getInfo()

    message.channel.send(`**${info.id}** ${info.name}
Movimientos: \`${info.moves.join(', ')}\`
Recibe doble daño de: \`${info.double_damage_from ? info.double_damage_from.length > 0 ? info.double_damage_from.join(', ') : 'Nadie' : 'Nadie'}\`
Hace doble daño a: \`${info.double_damage_to ? info.double_damage_to.length > 0 ? info.double_damage_to.join(', ') : 'Nadie' : 'Nadie'}\`
Recibe medio daño de: \`${info.half_damage_from ? info.half_damage_from.length > 0 ? info.half_damage_from.join(', ') : 'Nadie' : 'Nadie'}\`
Hace medio daño a: \`${info.half_damage_to ? info.half_damage_to.length > 0 ? info.half_damage_to.join(', ') : 'Nadie' : 'Nadie'}\`
No recibe daño de: \`${info.no_damage_from ? info.no_damage_from.length > 0 ? info.no_damage_from.join(', ') : 'Nadie' : 'Nadie'}\`
No le hace daño a: \`${info.no_damage_to ? info.no_damage_to.length > 0 ? info.no_damage_to.join(', ') : 'Nadie' : 'Nadie'}\``)

  }

})

client.login(settings.token)
```