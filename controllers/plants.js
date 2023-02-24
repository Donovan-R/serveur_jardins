// const { ParameterStatusMessage } = require('pg-protocol/dist/messages');
const db = require('../db');
const { StatusCodes } = require('http-status-codes');

const getAllPlants = async (req, res) => {
  const { rows: plants } = await db.query(
    // 'select * from plants ORDER BY name ASC'
    `select plant_id, name, img, to_char(plantation_date_start, 'dd/mm' ) AS plantation_date_start, TO_CHAR(plantation_date_end, 'dd/mm') AS plantation_date_end, TO_CHAR(harvest_date_start, 'dd/mm') AS harvest_date_start, TO_CHAR(harvest_date_end, 'dd/mm') AS harvest_date_end, plantation_details, sowing_details, crop, crop_rotation, rows_spacing_in_cm, plants_spacing_in_cm from plants ORDER BY name ASC`
  );

  res.status(StatusCodes.OK).json({ plants });
};

//*un seul plant

const getSinglePlant = async (req, res) => {
  const { id } = req.params;
  const {
    rows: [plant],
  } = await db.query(
    `SELECT plants.name AS plant_name, img, TO_CHAR(plantation_date_start, 'dd/mm' ) AS plantation_date_start, TO_CHAR(plantation_date_end, 'dd/mm') AS plantation_date_end, TO_CHAR(harvest_date_start, 'dd/mm') AS harvest_date_start, TO_CHAR(harvest_date_end, 'dd/mm') AS harvest_date_end, plantation_details, sowing_details, crop, crop_rotation, rows_spacing_in_cm, plants_spacing_in_cm FROM plants WHERE plants.plant_id = $1`,
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
    'SELECT plants.name AS plants_ennemies_name FROM plants INNER JOIN plants_ennemies ON plants.plant_id= plants_ennemies.plant_ennemy_id'
  );

  res.status(StatusCodes.OK).json({
    plant,
    sowing_inside,
    sowing_outside,
    plants_ennemies,
    plants_friends,
  });
};

module.exports = {
  getAllPlants,
  getSinglePlant,
};
