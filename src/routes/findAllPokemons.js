const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        Pokemon.findAll()
            .then(pokemon => {
                const message = 'La liste des pokémonsa a bien été récupérée.';
                res.json({message: message, data: pokemon});
            });
    });
}