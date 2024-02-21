const { Pokemon } = require('../db/sequelize');
const { Op } = require('sequelize');
const auth = require('../auth/auth');

module.exports = (app) => {
    app.get('/api/pokemons', auth, (req, res) => {
        if(req.query.name) {
            const name = req.query.name;
            const limit = parseInt(req.query.limit) || 5;
            const offset = parseInt(req.query.offset) || 0;
            if(name.length < 2) {
                const message = "Le terme de recherche doit contenir au moins 2 caractères.";
                return res.status(400).json({ message: message });
            }
            Pokemon.findAndCountAll({ 
                where: { 
                    name: { // ce 'name' est la propriété du modèle pokémon
                        [Op.like]: `%${name}%` // Ce 'name' est le critère de la recherche
                    } 
                },
                order: [['name', 'ASC']],
                limit: limit,
                offset: offset 
            })

            .then(({count, rows}) => {
                const pokemons = rows.map(pokemon => {
                    pokemon = pokemon.get({ plain: true});
                    delete pokemon.types_string;
                    return pokemon;
                });
                const message = `Il y a ${count} pokémon(s) qui correspondent au terme de recherche '${name}'.`;
                res.json({message: message, data: pokemons});
            })
            .catch(error => {
                const message = "La liste des pokémons n'a pas pu être récupérée. Réesssayez dans quelques instants.";
                res.status(500).json({message: message, data: error});
            });
        }
        else {
            Pokemon.findAll({ order: [['name', 'ASC']] })
            .then(result => {
                const pokemons = result.map(pokemon => {
                    pokemon = pokemon.get({ plain: true});
                    delete pokemon.types_string;
                    return pokemon;
                });
                const message = "La liste des pokémons a a bien été récupérée.";
                res.json({message: message, data: pokemons});
            })
            .catch(error => {
                const message = "La liste des pokémons n'a pas pu être récupérée. Réesssayez dans quelques instants.";
                res.status(500).json({message: message, data: error});
            });
        }
    });
}