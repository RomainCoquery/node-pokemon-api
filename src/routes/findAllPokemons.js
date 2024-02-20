const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        Pokemon.findAll()
            .then(result => {
                const pokemons = result.map(pokemon => {
                    pokemon = pokemon.get({ plain: true});
                    delete pokemon.types_string;
                    return pokemon;
                });
                const message = 'La liste des pokémonsa a bien été récupérée.';
                res.json({message: message, data: pokemons});
            })

            .catch(error => {
                const message = `La liste des pokémons n'a pas pu être récupérée. Réesssayez dans quelques instants.`;
                res.status(500).json({message: message, data: error});
            });
    });
}