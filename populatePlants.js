require('dotenv').config();
const db = require('./db');
const jsonPlants = require('./plants.json');

const start = async () => {
  try {
    await db.query('BEGIN');

    for (const plant of jsonPlants) {
      const { name, img, plantation_start, plantation_fin, recolte_start } =
        plant;

      const query = `INSERT INTO plants (name, img, plantation_start, plantation_fin, recolte_start) VALUES ($1, $2, $3, $4, $5)`;
      await db.query(query, [
        name,
        img,
        plantation_start,
        plantation_fin,
        recolte_start,
      ]);
    }

    await db.query('COMMIT');
    console.log('Données importées avec succès dans la table "plants"');
    process.exit(0);
  } catch (error) {
    await db.query('ROLLBACK');
    console.log(
      `Erreur lors de l'importation des données dans la table plants : ${error.message}`
    );
    process.exit(1);
  } finally {
    db.end();
  }
};

start();
