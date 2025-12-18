const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const matchRoutes = require('./routes/matchRoutes'); 

const app = express();

app.use(cors());
app.use(express.json());

// Cuando se buscan partidos va para matchRoutes.js.
app.use('/partidos', matchRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});