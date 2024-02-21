const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const sequelize = require('./src/db/sequelize');

const app = express();
const port = 3000;

app.use(favicon(`${__dirname}/favicon.ico`))
   .use(morgan('dev'))
   .use(express.json());

sequelize.initDb();

require('./src/routes/findAllPokemons')(app);
require('./src/routes/findPokemonByPk')(app);
require('./src/routes/createPokemon')(app);
require('./src/routes/updatePokemon')(app);
require('./src/routes/deletePokemon')(app);
require('./src/routes/login')(app);

app.use(({res}) => {
   const message = "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
   res.status(404).json({message: message});
});

app.listen( port, () => console.log(`Notre application Node est démarrée sur http://localhost:${port}`));