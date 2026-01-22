const axios = require('axios');
const prisma = require('../config/db');

const API_URL = 'https://api.football-data.org/v4/';
const API_KEY = process.env.FOOTBALL_API_KEY;

const leagueNames = { // Dictionary codes to names
  //'DED': 'Eredivisie',
  //'BSA': 'Campeonato Brasileiro Serie A',
  //'ELC': 'Championship',
  //'EC': 'European Championship',
  //'PPL': 'Primeira Liga',
  //'WC': 'Fifa World Cup',
  'CL': 'UEFA Champions League',
  'BL1': 'Bundesliga',
  'PD': 'Primera Division',
  'FL1': 'Ligue 1',
  'SA': 'Serie A',
  'PL': 'Premier League'
};

const statusOfGame = (apiStatus) => { // Status of the game
  const statusMap = {
    'NS': 'PENDIENTE',      // Not Started
    'TIMED': 'PENDIENTE',   // Timed (a punto de empezar)
    'LIVE': 'EN JUEGO',     // Live
    'IN_PLAY': 'EN JUEGO',  // In Play
    'PAUSED': 'PAUSADO',    // Paused
    'FT': 'FINALIZADO',     // Finished
    'AET': 'FINALIZADO',    // After Extra Time
    'PEN': 'FINALIZADO',    // After Penalties
    'PST': 'POSPUESTO',     // Postponed
    'CANC': 'CANCELADO',    // Cancelled
    'ABD': 'ABANDONADO'     // Abandoned
  }
  return statusMap[apiStatus] || apiStatus;
};

const getAvaibleLeagues = async() => { // Get the avaible legaue for free plan
  try {
    const response = await axios.get(`${API_URL}competitions`, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error in getAvailableLeagues:", error.message);
    throw error;
  }
};

const getDayRange = (fecha) => { // Get start and end date for a given day
  let dateString;
  if (fecha && fecha !== 'undefined' && fecha !== '') {
    dateString = fecha;
  } else {
    const now = new Date();
    dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  const start = new Date(`${dateString}T00:00:00.000Z`);
  const end = new Date(`${dateString}T23:59:59.999Z`);
  
  return { start, end, dateStr: dateString };
};

const getGamesCompetition = async (competitionCode, fecha) => { // Get games avaible for a competition in a date
  try {
    const code = competitionCode.toUpperCase();
    const { start, end, dateStr } = getDayRange(fecha);

    let compe = await prisma.competition.findUnique({ where: { code } });
    const CACHE_MINUTES = 10;
    const now = new Date();
    
    if (!compe) {
      compe = await prisma.competition.create({
        data: { code, name: leagueNames[code], lastUpdated: now }
      });
      await updateResultsForDate(code, dateStr);
    } else {
      const diff = (now - new Date(compe.lastUpdated)) / 60000;
      if (diff > CACHE_MINUTES) {
        await prisma.competition.update({
          where: { code },
          data: { lastUpdated: now }
        });
        await updateResultsForDate(code, dateStr);
      }
    }

    return await prisma.match.findMany({
      where: {
        matchDate: { gte: start, lte: end },
        leagueName: { equals: leagueNames[code]}
      },
      orderBy: { matchDate: 'asc' }
    });
  } catch (error) {
    console.error("❌ Error in getGamesCompetition:", error.message);
    throw error;
  }
};

const updateResultsForDate = async (competitionCode, fecha) => { // Update match results for a competition
  try {
    const { start } = getDayRange(fecha);
    const dateStr = start.toISOString().slice(0, 10);

    console.log(`📡 Consulting API: ${competitionCode} for day ${dateStr}`);
    const url = `${API_URL}competitions/${competitionCode}/matches?dateFrom=${dateStr}&dateTo=${dateStr}`;
    
    const response = await axios.get(url, { headers: { 'X-Auth-Token': API_KEY } });
    const apiMatches = response.data.matches || [];

    if (apiMatches.length === 0) return { updatedMatches: 0, apiMatches: 0 };

    const updatePromises = apiMatches.map((m) => {
      const home = m.score?.fullTime?.home ?? null;
      const away = m.score?.fullTime?.away ?? null;
      const status = m.status; 

      return prisma.match.updateMany({
        where: { apiMatchId: m.id },
        data: { 
          homeGoals: home, 
          awayGoals: away, 
          status: status 
        }
      });
    });

    const results = await prisma.$transaction(updatePromises);
    const updatedCount = results.reduce((acc, res) => acc + res.count, 0);

    return { updatedMatches: updatedCount, apiMatches: apiMatches.length };
  } catch (err) {
    console.error(`❌ Error in updateResultsForDate (${competitionCode}):`, err.message);
    throw err;
  }
};

module.exports = { getGamesCompetition, getAvaibleLeagues, updateResultsForDate };