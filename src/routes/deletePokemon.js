const { Pokemon } = require('../db/sequelize');

module.exports = (app) => {
    app.delete('/api/pokemons/:id', (req, res) => {
        Pokemon.findByPk(req.params.id)
        .then(result => {
            if(result === null) {
                const message = `Le pokémon demandé n'existe pas. Réessayez avec un autre identifiant.`;
                return res.status(404).json({message: message});
            } 
            const pokemonDeleted = result.get({ plain: true});
            delete pokemonDeleted.types_string;
            Pokemon.destroy({
                where: { id: result.id }
            })
            .then( _ => {
                const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`;
                res.json({message: message, data: pokemonDeleted});
            });
        })
        .catch(error => {
            const message = `Le pokémon n'a pas pu être supprimé. Réessayer dans quelques instants`;
            res.status(500).json({message: message, data: error});
        });
    });
}