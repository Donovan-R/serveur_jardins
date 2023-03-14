const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//* Tous les plants
const getAllPlants = async (req, res) => {
  const { rows: plants } = await db.query(
    // 'select * from plants ORDER BY name ASC'
    `SELECT plant_id, name, main_img, img_inter, img_plant, to_char(plantation_date_start, 'dd/mm' ) AS plantation_date_start, TO_CHAR(plantation_date_end, 'dd/mm') AS plantation_date_end, TO_CHAR(harvest_date_start, 'dd/mm') AS harvest_date_start, TO_CHAR(harvest_date_end, 'dd/mm') AS harvest_date_end, plantation_details, sowing_details, crop, crop_rotation, rows_spacing_in_cm, plants_spacing_in_cm FROM plants ORDER BY name ASC`
  );

  res.status(StatusCodes.OK).json({ plants });
};

//*un seul plant

const getSinglePlant = async (req, res) => {
  const { id } = req.params;
  const {
    rows: [plant],
  } = await db.query(
    `SELECT plants.name AS plant_name, main_img, img_inter, img_plant, TO_CHAR(plantation_date_start, 'dd/mm' ) AS plantation_date_start, TO_CHAR(plantation_date_end, 'dd/mm') AS plantation_date_end, TO_CHAR(harvest_date_start, 'dd/mm') AS harvest_date_start, TO_CHAR(harvest_date_end, 'dd/mm') AS harvest_date_end, plantation_details, sowing_details, crop, crop_rotation, rows_spacing_in_cm, plants_spacing_in_cm FROM plants WHERE plants.plant_id = $1`,
    [id]
  );
  const {
    rows: [sowing_inside],
  } = await db.query(
    `SELECT TO_CHAR(sowing_date_start, 'dd/mm') AS sowing_date_start_inside, TO_CHAR(sowing_date_end, 'dd/mm') AS sowing_date_end_inside FROM sowing_periods INNER JOIN plants on plants.plant_id=sowing_periods.plant_id INNER JOIN sowing_locations ON sowing_locations.sowing_location_id = sowing_periods.sowing_location_id WHERE sowing_locations.sowing_location_id = 1 AND plants.plant_id = $1`,
    [id]
  );
  const {
    rows: [sowing_outside],
  } = await db.query(
    `SELECT TO_CHAR(sowing_date_start, 'dd/mm') AS sowing_date_start_outside, TO_CHAR(sowing_date_end, 'dd/mm') AS sowing_date_end_outside FROM sowing_periods INNER JOIN plants on plants.plant_id=sowing_periods.plant_id INNER JOIN sowing_locations ON sowing_locations.sowing_location_id = sowing_periods.sowing_location_id WHERE sowing_locations.sowing_location_id = 2 AND plants.plant_id = $1`,
    [id]
  );
  const {
    rows: [plants_friends],
  } = await db.query(
    'SELECT plants.name AS plants_friends_name FROM plants INNER JOIN plants_friends ON plants.plant_id=plants_friends.plant_friend_id WHERE plants_friends.plant_id=$1',
    [id]
  );
  const {
    rows: [plants_ennemies],
  } = await db.query(
    'SELECT plants.name AS plants_ennemies_name FROM plants INNER JOIN plants_ennemies ON plants.plant_id= plants_ennemies.plant_ennemy_id WHERE plants_ennemies.plant_id=$1',
    [id]
  );

  res.status(StatusCodes.OK).json({
    plant,
    sowing_inside,
    sowing_outside,
    plants_ennemies,
    plants_friends,
  });
};

//* éditer un plant (optionnel)
const editSinglePlantInfos = async (req, res) => {
  const {
    newPlant: {
      name,
      main_img,
      img_inter,
      img_plant,
      harvest_date_start,
      harvest_date_end,
      plantation_date_start,
      plantation_date_end,
      plantation_details,
      sowing_details,
      crop,
      crop_rotation,
      rows_spacing_in_cm,
      plants_spacing_in_cm,
      // sowing_date_start_inside,
      // sowing_date_end_inside,
      // sowing_date_start_outside,
      // sowing_date_end_outside,
      // plants_friends_name,
      // plants_ennemies_name,
    },
  } = req.body;
  const { id: editPlantId } = req.params;
  const {
    rows: [plant],
  } = await db.query(
    `UPDATE plants SET name = $1, main_img = $2, img_inter = $3, img_plant = $4, harvest_date_start = $5, harvest_date_end = $6, plantation_date_start = $7, plantation_date_end = $8, plantation_details = $9, sowing_details = $10, crop = $11, crop_rotation = $12, rows_spacing_in_cm = $13, plants_spacing_in_cm = $14 WHERE plants.plant_id = $15 RETURNING *`,
    [
      name,
      main_img,
      img_inter,
      img_plant,
      harvest_date_start,
      harvest_date_end,
      plantation_date_start || null,
      plantation_date_end || null,
      plantation_details || null,
      sowing_details || null,
      crop || null,
      crop_rotation || null,
      rows_spacing_in_cm || null,
      plants_spacing_in_cm || null,
      editPlantId,
    ]
  );
  const {
    sowingInside: { sowing_date_start_inside, sowing_date_end_inside },
  } = req.body;
  const {
    rows: [sowing_inside],
  } = await db.query(
    `UPDATE sowing_periods SET sowing_date_start = $1, sowing_date_end=$2 WHERE sowing_location_id=1 AND plant_id=$3`,
    [
      sowing_date_start_inside || null,
      sowing_date_end_inside || null,
      editPlantId,
    ]
  );
  const {
    sowingOutside: { sowing_date_start_outside, sowing_date_end_outside },
  } = req.body;
  const {
    rows: [sowing_outside],
  } = await db.query(
    `UPDATE sowing_periods SET sowing_date_start = $1, sowing_date_end=$2 WHERE sowing_location_id=2 AND plant_id=$3`,
    [
      sowing_date_start_outside || null,
      sowing_date_end_outside || null,
      editPlantId,
    ]
  );

  res.status(StatusCodes.OK).json({ plant, sowing_inside, sowing_outside });
};

//*créer un plant (dashboard donovan)
const addPlant = async (req, res) => {
  const {
    newPlant: {
      name,
      main_img,
      img_inter,
      img_plant,
      harvest_date_start,
      harvest_date_end,
      plantation_date_start,
      plantation_date_end,
      plantation_details,
      sowing_details,
      crop,
      crop_rotation,
      rows_spacing_in_cm,
      plants_spacing_in_cm,
    },
  } = req.body;
  const {
    rows: [plant],
  } = await db.query(
    'INSERT into plants (name, main_img, img_inter, img_plant, harvest_date_start, harvest_date_end, plantation_date_start, plantation_date_end, plantation_details, sowing_details, crop, crop_rotation, rows_spacing_in_cm, plants_spacing_in_cm) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [
      name,
      main_img,
      img_inter,
      img_plant,
      harvest_date_start || null,
      harvest_date_end || null,
      plantation_date_start || null,
      plantation_date_end || null,
      plantation_details || null,
      sowing_details || null,
      crop || null,
      crop_rotation || null,
      rows_spacing_in_cm || null,
      plants_spacing_in_cm || null,
    ]
  );
  const {
    rows: [{ plant_id: plantToAddId }],
  } = await db.query(`select plant_id from plants where name=$1`, [name]);
  const sowing_inside_id = 1;
  const {
    sowingInside: { sowing_date_start_inside, sowing_date_end_inside },
  } = req.body;
  const {
    rows: [sowing_inside],
  } = await db.query(
    `INSERT into sowing_periods ( plant_id, sowing_location_id, sowing_date_start, sowing_date_end)  VALUES ($1, $2, $3, $4) RETURNING*`,
    [
      plantToAddId,
      sowing_inside_id,
      sowing_date_start_inside || null,
      sowing_date_end_inside || null,
    ]
  );

  const sowing_outside_id = 2;
  const {
    sowingOutside: { sowing_date_start_outside, sowing_date_end_outside },
  } = req.body;
  const {
    rows: [sowing_outside],
  } = await db.query(
    `INSERT into sowing_periods ( plant_id, sowing_location_id, sowing_date_start, sowing_date_end)  VALUES ($1, $2, $3, $4) RETURNING*`,
    [
      plantToAddId,
      sowing_outside_id,
      sowing_date_start_outside || null,
      sowing_date_end_outside || null,
    ]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ plant, sowing_inside, sowing_outside });
};

const deleteSinglePlant = async (req, res) => {
  const { id: plant_id } = req.params;

  const { rows: plant } = await db.query(
    'DELETE FROM plants WHERE plant_id = $1 RETURNING *',
    [plant_id]
  );
  res.status(StatusCodes.OK).json({ plant });
};

module.exports = {
  getAllPlants,
  getSinglePlant,
  editSinglePlantInfos,
  addPlant,
  deleteSinglePlant,
};
