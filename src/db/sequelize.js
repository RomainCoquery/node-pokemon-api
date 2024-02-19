const { Sequelize, DataTypes } = require('sequelize');
const PokemonModel = require('../models/pokemon');
const pokemons = require('./mock-pokemon');

const sequelize = new Sequelize('pokedex', 'root', '', {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: true
    });

sequelize.authenticate()
.then(_ => console.log('La connection à la BDD a bien été établie.'))
.catch(error => console.error(`Impossible de se connecter à la BDD : ${error}`));

const Pokemon = PokemonModel(sequelize, DataTypes);

const initDb = () => {
    return sequelize.sync({force: true}).then(_ => {
        pokemons.map(pokemon => {
            Pokemon.create({
                name: pokemon.name,
                hp: pokemon.hp,
                cp: pokemon.cp,
                picture: pokemon.picture,
                types: pokemon.types
            }).then(pokemon => console.log(pokemon.toJSON()));
        });
        console.log('La base de donnée a bien été initialisée.')
    });
}

module.exports = {
    initDb, Pokemon
}