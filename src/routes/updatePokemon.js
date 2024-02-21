const { Pokemon } = require('../db/sequelize');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const auth = require('../auth/auth');
const authorizedFfields = ['name', 'hp', 'cp', 'types', 'picture'];

module.exports = (app) => {
    app.put('/api/pokemons/:id', auth, (req, res) => {
        const id = req.params.id;
        for(const field in req.body) {
            if(!authorizedFfields.includes(field)) {
                const message = `La propriété '${field}' n'est pas modifiable. Seules les propriétés suivantes le sont : ${authorizedFfields}`;
                return res.status(404).json({message});
            }
        }
        Pokemon.update(req.body, {
            where: { id: id }
        })
        .then( _ => {
            return Pokemon.findByPk(id).then(result => {
                if(result === null) {
                    const message = "Le pokémon demandé n'existe pas. Réessayez avec un autre identifiant.";
                    return res.status(404).json({message});
                }
                const pokemon = result.get({ plain: true});
                delete pokemon.types_string;
                const message = `Le pokémon ${pokemon.name} a bien été modifié.`;
                res.json({message: message, data: pokemon});
            });
        })
        .catch(error => {
            if( error instanceof ValidationError) {
                return res.status(400).json({message: error.message, data: error});
            }
            if( error instanceof UniqueConstraintError) {
                return res.status(400).json({message: error.message, data: error});
            }
            const message = "le pokémon n'a pas pu être modifié. Réessayez dans quelques instants.";
            res.status(500).json({message: message, data: error});
        });
    });
}