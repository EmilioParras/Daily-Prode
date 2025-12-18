const express = require('express');
const router = express.Router();    
const { getGamesCompetition } = require('../services/footbalService');

router.get('/:code', async (req, res) => {
    const { code } = req.params; // Ejemplo: 'PL' o 'PD'
    const result = await getGamesCompetition(code.toUpperCase()); // Espera que getGamesCompetiton devuelva los partidos de esa competicion.
    res.json(result);
});

module.exports = router;  