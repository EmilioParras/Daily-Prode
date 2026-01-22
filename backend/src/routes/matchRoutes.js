const express = require('express');
const router = express.Router(); 
const { getGamesCompetition, getAvaibleLeagues } = require('../services/footballService');

const leagueNames = { 
    'CL': 'UEFA Champions League',
    'BL1': 'Bundesliga',
    'PD': 'Primera Division',
    'FL1': 'Ligue 1',
    'SA': 'Serie A',
    'PL': 'Premier League'
};

router.get('/competitions', async (req, res) => {
    try {
        const data = await getAvaibleLeagues();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Cant get the leagues' });
    }
});

router.get('/fixture/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const fechaQuery = req.query.date || req.query.fecha; 

        if (!leagueNames[code]) {
            return res.status(404).json({ error: "League code is not available." });
        }

        const matches = await getGamesCompetition(code, fechaQuery);
        res.json(matches);

    } catch (error) {
        console.error("❌ Error in the fixture route:", error.message);
        res.status(500).json({ error: "Error processing the request." });
    }
});

module.exports = router;