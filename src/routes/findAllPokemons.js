const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.get('/api/pokemons', (req, res) => {
        Pokemon.findAll()
            .then(pokemon => {
                const message = 'La liste des pokémons a bien été récupérée.';
                res.json({message: message, data: pokemon});
            })

            .catch(error => {
                const message = `La liste des pokémons n'a pas pu être récupérée. Réesssayez dans quelques instants.`;
                res.status(500).json({message: message, data: error});
            });
    });
}