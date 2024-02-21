const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Pokemon } = require('../db/sequelize');
const auth = require('../auth/auth');
const authorizedFfields = ['name', 'hp', 'cp', 'types', 'picture'];

module.exports = (app) => {
    app.post('/api/pokemons', auth, (req, res) => {
        for(const field in req.body) {
            if(!authorizedFfields.includes(field)) {
                const message = `La propriété '${field}' n'est pas modifiable. Seules les propriétés suivantes le sont : ${authorizedFfields}`;
                return res.status(404).json({message});
            }
        }
        Pokemon.create(req.body)
            .then(result => {
                const pokemon = result.get({ plain: true});
                delete pokemon.types_string;
                const message = `Le pokémon ${pokemon.name} a bien été créé.`;
                res.json({message: message, data: pokemon});
            })
            .catch(error => {
                if( error instanceof ValidationError) {
                    return res.status(400).json({message: error.message, data: error});
                }
                if( error instanceof UniqueConstraintError) {
                    return res.status(400).json({message: error.message, data: error});
                }
                const message = "Le pokémon n'a pas pu être ajouté. Réessayez dans quelques instants.";
                res.status(500).json({message: message, data: error});
            });
    });
}