require('dotenv').config();
const db = require('./db');
const jsonPlants = require('./plants.json');

const start = async () => {
  try {
    await db.query('BEGIN');

    for (const plant of jsonPlants) {
      const {
        name,
        main_img,
        img_inter,
        img_plant,
        plantation_date_start,
        plantation_date_end,
        harvest_date_start,
        harvest_date_end,
        plantation_details,
        sowing_details,
        crop,
        crop_rotation,
        rows_spacing_in_cm,
        plants_spacing_in_cm,
      } = plant;

      const query = `INSERT INTO plants (name,  main_img, img_inter, img_plant, plantation_date_start, plantation_date_end, harvest_date_start, harvest_date_end, plantation_details, sowing_details, crop, crop_rotation, rows_spacing_in_cm, plants_spacing_in_cm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
      await db.query(query, [
        name,
        main_img,
        img_inter,
        img_plant,
        plantation_date_start,
        plantation_date_end,
        harvest_date_start,
        harvest_date_end,
        plantation_details,
        sowing_details,
        crop,
        crop_rotation,
        rows_spacing_in_cm,
        plants_spacing_in_cm,
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
