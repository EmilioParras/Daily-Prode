const express = require('express');
const router = express.Router(); 
const prisma = require('../config/db');
const { getGamesCompetition } = require('../services/footballService');
const { getAvaibleLeagues } = require('../services/footballService');

// DICCIONARIO DE CÓDIGOS A NOMBRES
const leagueNames = {
    'WC': 'Fifa World Cup',
    'CL': 'UEFA Champions League',
    'BL1': 'Bundesliga',
    'DED': 'Eredivisie',
    'BSA': 'Campeonato Brasileiro Serie A',
    'PD': 'Primera Division',
    'FL1': 'Ligue 1',
    'ELC': 'Championship',
    'PPL': 'Primeira Liga',
    'EC': 'European Championship',
    'SA': 'Serie A',
    'PL': 'Premier League'
};

// RUTA: GET /api/competitions (Trae las ligas disponibles en la API con el plan FREE)
router.get('/competitions', async (req, res) => {
    try {
        const data = await getAvaibleLeagues();
        res.json(data);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'No se pudieron obtener las ligas' });
    }
});

// RUTA: GET /fixture/:code (Ej: /fixture/PL)
router.get('/fixture/:code', async (req, res) => {
    try {
        const code = req.params.code.toUpperCase();
        const fullLeagueName = leagueNames[code];

        if (!fullLeagueName) {
            return res.status(404).json({ error: "Código de liga no soportado o inválido." });
        }

        // 1. Busca los partidos en la DB primero
        let matches = await prisma.match.findMany({
            where: { leagueName: fullLeagueName },
            orderBy: { matchDate: 'asc' }
        });

        // 2. Si NO hay partidos en la DB, los trae desde la API externa
        if (matches.length === 0) {
            console.log(`Buscando datos nuevos para ${fullLeagueName}...`);
            await getGamesCompetition(code);
            
            // Consultamos la DB ahora que ya están guardados
            matches = await prisma.match.findMany({
                where: { leagueName: fullLeagueName },
                orderBy: { matchDate: 'asc' }
            });
        }

        res.json(matches);

    } catch (error) {
        console.error("❌ Error en la ruta de partidos:", error.message);
        res.status(500).json({ error: "Error al procesar la solicitud" });
    }
});

module.exports = router;