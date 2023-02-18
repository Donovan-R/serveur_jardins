require('dotenv').config();
const db = require('./db');
const jsonsowing_periods = require('./sowing_periods.json');

const start = async () => {
  try {
    await db.query('BEGIN');

    for (const period of jsonsowing_periods) {
      const {
        plant_id,
        sowing_location_id,
        sowing_date_start,
        sowing_date_end,
      } = period;

      const query = `INSERT INTO sowing_periods (plant_id, sowing_location_id, sowing_date_start, sowing_date_end) VALUES ($1, $2, $3, $4)`;
      await db.query(query, [
        plant_id,
        sowing_location_id,
        sowing_date_start,
        sowing_date_end,
      ]);
    }

    await db.query('COMMIT');
    console.log('Données importées avec succès dans la table "sowing_periods"');
    process.exit(0);
  } catch (error) {
    await db.query('ROLLBACK');
    console.log(
      `Erreur lors de l'importation des données dans la table sowing_periods : ${error.message}`
    );
    process.exit(1);
  } finally {
    db.end();
  }
};

start();
