// Guardar en: backend/repair.js
require('dotenv').config(); // Carga tus variables de entorno
const { updateResultsForDate } = require('./src/services/footballService');
const prisma = require('./src/config/db');

const LEAGUE_CODES = ['PL', 'SA', 'PD', 'BL1', 'CL', 'FL1'];
const delay = ms => new Promise(res => setTimeout(res, ms));

async function repair() {
  console.log("🚀 Iniciando reparación...");
  try {
    const matchesToFix = await prisma.match.findMany({
      where: {
        status: { in: ['PENDIENTE', 'TIMED', 'SCHEDULED'] },
        matchDate: { lt: new Date() }
      }
    });

    if (matchesToFix.length === 0) {
      console.log("✅ Nada que reparar.");
      return;
    }

    const dates = [...new Set(matchesToFix.map(m => m.matchDate.toISOString().slice(0, 10)))];
    console.log(`🔎 Días detectados: ${dates.length}`);

    for (const date of dates) {
      for (const code of LEAGUE_CODES) {
        try {
          const result = await updateResultsForDate(code, date);
          if (result.apiMatches > 0) {
            console.log(`   ✅ ${code} ${date}: Actualizados ${result.updatedMatches}`);
          }
        } catch (err) {
          console.error(`   ❌ Error en ${code}:`, err.message);
          if (err.response?.status === 429) await delay(30000);
        }
        await delay(6500);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

repair();