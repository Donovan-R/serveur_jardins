require('dotenv').config();
const db = require('./db');
const jsonPlants_details = require('./plants_details.json');

const start = async () => {
  try {
    await db.query('BEGIN');

    for (const plant of jsonPlants_details) {
      const {
        plant_id,
        semis_abri_start,
        semis_abri_fin,
        semis_terre_start,
        semis_terre_fin,
        recolte_fin,
        plantation_details,
        culture,
        friends_plants,
        ennemy_plants,
        rotation_cultures,
      } = plant;

      const query = `INSERT INTO plants_details (plant_id,
        semis_abri_start,
        semis_abri_fin,
        semis_terre_start,
        semis_terre_fin,
        recolte_fin,
        plantation_details,
        culture,
        friends_plants,
        ennemy_plants,
        rotation_cultures) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
      await db.query(query, [
        plant_id,
        semis_abri_start,
        semis_abri_fin,
        semis_terre_start,
        semis_terre_fin,
        recolte_fin,
        plantation_details,
        culture,
        friends_plants,
        ennemy_plants,
        rotation_cultures,
      ]);
    }

    await db.query('COMMIT');
    console.log('Données importées avec succès dans la table "plants_details"');
    process.exit(0);
  } catch (error) {
    await db.query('ROLLBACK');
    console.log(
      `Erreur lors de l'importation des données dans la table plants_details : ${error.message}`
    );
    process.exit(1);
  } finally {
    db.end();
  }
};

start();
