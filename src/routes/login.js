const { User } = require('../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../auth/private_key');

module.exports = (app) => {
    app.post('/api/login', (req, res) => {

        if(req.body.username === undefined) {
            const message = "Le nom de l'utilisateur est requis.";
            return res.status(400).json({ message: message});
        }

        if(req.body.password === undefined) {
            const message = "Le mot de passe est requis.";
            return res.status(400).json({ message: message});
        }

        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {

            if(!user) {
                const message = "L'utilisateur demandé n'existe pas.";
                return res.status(404).json({message: message});
            }

            bcrypt.compare(req.body.password, user.password)
            .then(isPasswordValid => {
                if(!isPasswordValid) {
                    const message = "Le mot de passe est incorrect.";
                    return res.status(401).json({message: message});
                }
                const token = jwt.sign(
                    { userId: user.id },
                    privateKey,
                    { expiresIn: '24h' }
                );
                const message = "L'utilisateur a été connecté avec succès.";
                return res.json({message: message, data: user, token: token});
            });
        })
        .catch(error => {
            const message = "L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.";
            return res.status(500).json({message: message, data: error});
        });
    });
}