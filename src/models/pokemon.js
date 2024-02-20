const validTypes = ['Plante', 'Poison', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fée'];

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: `Le nom est déjà pris.` },
            validate: {
                notEmpty: { msg: `Le champs nom ne peut pas être vide.` },
                notNull: { msg: `Le nom est une propriété requise.` },
                len: {
                    args: [1, 25],
                    msg: `Le nom doit être composé de 1 à 25 caractères.`
                },
                is: {
                    args: /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 -]+$/i,
                    msg: `Le nom ne peut contenir que des caractères numériques, alphabétiques avec ou sans accents, des espaces ou des tirets.`
                }
            }
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de vie.` },
                notNull: { msg: `Les points de vie sont une propriété requise.` },
                min: {
                    args: [0],
                    msg: 'Les points de vie doivent être supérieur ou égal à 0.'
                },
                max: {
                    args: [999],
                    msg: 'Les points de vie doivent être inférieur ou égal à 999.'
                },
            }
        },
        cp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de dégats.` },
                notNull: { msg: `Les points de dégats sont une propriété requise.` },
                min: {
                    args: [0],
                    msg: 'Les points de dégâts doivent être supérieur ou égal à 0.'
                },
                max: {
                    args: [99],
                    msg: 'Les points de dégâts doivent être inférieur ou égal à 99.'
                },
            }
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: { msg: `Utilisez uniquement une URL valide pour l'image.` },
                notNull: { msg: `L'image est une propriété requise.` }
            }
        },
        types_string: {
            type: DataTypes.STRING,
            allowNull: false
        },
        types: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            get() {
                if( this.getDataValue('types_string') !== undefined ) {
                    return this.getDataValue('types_string').split(',');
                }
                return this.getDataValue('types');
            },
            set(types) {
                if( Array.isArray(types) ) {
                    this.setDataValue('types_string', types.join());
                }
                this.setDataValue('types', types);
            },
            validate: {
                notNull: { msg: `Les types sont une propriété requise.` },
                isTypesValid(value) {
                    if(!value) {
                        throw new Error(`Un pokémon doit au moins avoir un type.`);
                    }
                    if(!Array.isArray(value)) {
                        throw new Error(`Le ou les types d'un pokémon doivent être dans un tableau de chaines de caractères.`);
                    }
                    if(value.length > 3) {
                        throw new Error(`Un pokémon ne peut pas avoir plus de trois types.`);
                    }
                    value.forEach(type => {
                        if(!validTypes.includes(type)) {
                            throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}.`);
                        }
                    });
                }
            }
        }
    },
    {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
    });
}