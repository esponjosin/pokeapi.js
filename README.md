## PokeApi.js

```
npm i pokeapi.js
```

[Spanish](https://github.com/esponjosin/pokeapi.js/blob/master/SPANISH.md)


## Info

```js
/**
 * @param {string} [dir] Path where the cache will be stored
 */

const PokeClient = new (require('pokeapi.js'))(dir)
```

# findPoke

```js
/**
 * @param {string/number} [poke] Name or id of the pokemon to search
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findPoke('1')

/**
Expected Promise Output
{<Pokemon> class}
 */
```

# findMove

```js
/**
 * @param {string/number} [move] Name or id of the move to search
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findMove('1')

/**
Expected Promise Output
{<Move> class}
 */
```

# findType

```js
/**
 * @param {string/number} [type] Name or id of the type to search
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findType('1')

/**
Expected Promise Output
{<Type> class}
 */
```

# findAbility

```js
/**
 * @param {string/number} [ability] Name or id of the ability to search
 */

const PokeClient = new (require('pokeapi.js'))(__dirname)

PokeClient.findAbility('1')

/**
Expected Promise Output
{<Ability> class}
 */
```

## Example with discord.js

```js
const Discord = require('discord.js');
const PokeClient = new (require('pokeapi.js'))(__dirname)
 
const client = new Discord.Client();
 
const settings = {
  prefix: '!',
  token: 'YOURTOKEN'
}
 
client.on('message', async message => {
 
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 
  var args = message.content.split(' ').slice(1);
 
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'pokemon') {
      
      if(!args[0]) return message.channel.send(':x: | You need to enter the name of a pokemon or its id')

      let Pokemon = await PokeClient.findPoke(args[0]).catch(e => false)

      if(!Pokemon) return message.channel.send(':x: | The pokemon was not found')

      let moves = Pokemon.getMoves()
      let abilities = Pokemon.getAbilities()
      let types = Pokemon.getTypes()

      message.channel.send(`**${Pokemon.getID()}** ${Pokemon}
Moves: ${moves.map(x => `\`${x}\``).join(', ')}
Abilities: ${abilities.map(x => `\`${x}\``).join(', ')}
Types: ${types.map(x => `\`${x}\``).join(', ')}`)

  }
  else if(command == 'move') {

    if(!args[0]) return message.channel.send(':x: | You need to enter the name of a move or its id')

    let Move = await PokeClient.findMove(args[0]).catch(e => false)

    if(!Move) return message.channel.send(':x: | The move was not found')

    let info = await Move.getInfo()
    
    message.channel.send(`**${info.id}** ${info.name}
Accuracy: \`${info.accuracy || 0}\`
Power: \`${info.power || 0}\`
PP: \`${info.pp || 0}\`
Class: \`${info.class || 'None'}\`
Target: \`${info.target || 'None'}\`
Effect: \`${info.effect || 'None'}\`
Flavor effect: \`${info.flavor_effect || 'None'}\``)

  }
  else if(command == 'ability') {

    if(!args[0]) return message.channel.send(':x: | You need to enter the name of a move or its id')

    let Ability = await PokeClient.findAbility(args[0]).catch(e => false)

    if(!Ability) return message.channel.send(':x: | The move was not found')

    let info = await Ability.getInfo()
    
    message.channel.send(`**${info.id}** ${info.name}
Accuracy: \`${info.accuracy || 0}\`
Effect: \`${info.effect || 'None'}\`
Flavor effect: \`${info.flavor_effect || 'None'}\``)

  }
  else if(command == 'type') {

    if(!args[0]) return message.channel.send(':x: | You need to enter the name of a type or its id')

    let Type = await PokeClient.findType(args[0]).catch(e => false)

    if(!Type) return message.channel.send(':x: | The type was not found')

    let info = await Type.getInfo()

    message.channel.send(`**${info.id}** ${info.name}
Moves: \`${info.moves.join(', ')}\`
Take double damage from: \`${info.double_damage_from ? info.double_damage_from.length > 0 ? info.double_damage_from.join(', ') : 'None' : 'None'}\`
Does double damage to: \`${info.double_damage_to ? info.double_damage_to.length > 0 ? info.double_damage_to.join(', ') : 'None' : 'None'}\`
Take half damage from: \`${info.half_damage_from ? info.half_damage_from.length > 0 ? info.half_damage_from.join(', ') : 'None' : 'None'}\`
Does half damage to: \`${info.half_damage_to ? info.half_damage_to.length > 0 ? info.half_damage_to.join(', ') : 'None' : 'None'}\`
Does not take damage from: \`${info.no_damage_from ? info.no_damage_from.length > 0 ? info.no_damage_from.join(', ') : 'None' : 'None'}\`
It doesn't hurt: \`${info.no_damage_to ? info.no_damage_to.length > 0 ? info.no_damage_to.join(', ') : 'None' : 'None'}\``)

  }

})

client.login(settings.token)
```