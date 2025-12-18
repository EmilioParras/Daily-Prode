const axios = require('axios');
const prisma = require('../config/db');

const API_URL = 'https://api.football-data.org/v4/';
const API_KEY = process.env.FOOTBALL_API_KEY;

const getGamesCompetition = async (competitionCode) => {
  try {
    const response = await axios.get(`${API_URL}competitions/${competitionCode}/matches`, { // Consulta en la API externa y devuelve los partidos de esa competicion.
      headers: { 'X-Auth-Token': API_KEY }
    });

    const matches = response.data.matches;
    const leagueName = response.data.competition.name;

    for (const m of matches) {
      await prisma.match.upsert({
        where: { apiMatchId: m.id },
        update: {
          status: m.status,
          homeGoals: m.score.fullTime.home,
          awayGoals: m.score.fullTime.away,
          matchDate: new Date(m.utcDate)
        },
        create: {
          apiMatchId: m.id,
          leagueName: leagueName,
          homeTeam: m.homeTeam.name,
          awayTeam: m.awayTeam.name,
          homeLogo: m.homeTeam.crest,
          awayLogo: m.awayTeam.crest,
          matchDate: new Date(m.utcDate),
          status: m.status,
          homeGoals: m.score.fullTime.home,
          awayGoals: m.score.fullTime.away 
        }
      });
    }

    return {
      succes: true,
      message: `Se sincronizaron ${matches.length} partidos de ${leagueName}`
    };

  
  } catch (error) {
    console.error("❌ Error en syncMatches:", error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

module.exports = { getGamesCompetition }; // Exporto la funcion getGamesCompetition para usarla en matchRoutes.js.