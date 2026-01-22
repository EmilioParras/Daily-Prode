const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const matchRoutes = require('./routes/matchRoutes'); 
const { updateResultsForDate } = require('./services/footballService');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', matchRoutes);
const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
});

const LEAGUE_CODES = ['PL', 'SA', 'PD', 'BL1', 'CL'];
const POLL_MINUTES = 5;
const delay = ms => new Promise(res => setTimeout(res, ms));

const pollResults = async () => { // Refresh results every 6 minutes
  const now = new Date();
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const today = formatDate(now);
  const yesterday = formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));

  const datesToUpdate = [yesterday, today];

  for (const dateStr of datesToUpdate) {
    console.log(`--- Procesando fecha: ${dateStr} ---`);
    for (const code of LEAGUE_CODES) {
      try {
        const result = await updateResultsForDate(code, dateStr);
        if (result.apiMatches > 0) {
          console.log(` ✅ ${code}: API=${result.apiMatches} | DB_Updated=${result.updatedMatches}`);
        }
        await delay(6000); 
      } catch (e) {
        console.error(`Error in ${code} for date ${dateStr}:`, e.message);
      }
    }
  }
};

pollResults();
setInterval(pollResults, POLL_MINUTES * 60 * 1000);