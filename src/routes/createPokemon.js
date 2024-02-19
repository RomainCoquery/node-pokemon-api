const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.post('/api/pokemons', (req, res) => {
        Pokemon.create(req.body)
            .then(pokemon => {
                const message = `Le pokémon ${req.body.name} a bien été créé.`;
                res.json({message: message, data: pokemon});
            })

            .catch(error => {
                const message = `Le pokémon n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                res.status(500).json({message: message, data: error});
            });
    });
}