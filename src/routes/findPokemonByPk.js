const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.get('/api/pokemons/:id', (req, res) => {
        Pokemon.findByPk(req.params.id)
            .then(pokemon => {
                if(pokemon === null) {
                    const message = `Le pokémon demandé n'existe pas. Réessayez avec un autre identifiant.`;
                    return res.status(404).json({message: message});
                }
                const message = 'Un pokémon a bien été trouvé.';
                res.json({message: message, data: pokemon});
            })
            .catch(error => {
                const message = `Le pokémon n'a pas pu être récupéré. Réessayez dans quelques instants`;
                res.status(500).json({message: message, data: error});
            });
    });
}