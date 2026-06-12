const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

require('./startup/db')(); // Conectar banco
require('./startup/router')(app); // Rodar o router


// Iniciando o Serviço API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}/api-docs`));
