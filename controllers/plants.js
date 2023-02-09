// const { ParameterStatusMessage } = require('pg-protocol/dist/messages');
const db = require('../db');
const { StatusCodes } = require('http-status-codes');

const getAllPlantsStatic = async (req, res) => {
  const { rows } = await db.query(queryString, parameters);
  res.status(200).send({ plants: rows, nbHits: getAllPlants.length });
};

// const getAllPlants = async (req, res) => {
//   const { name, sort, fields } = req.query;

//   let queryString = 'select * from plants';
//   let parameters = [];

//   if (fields) {
//     queryString = `select ${fields} from plants`;
//   }

//   if (name) {
//     queryString += ' where name ilike $1';
//     parameters.push(`%${name}`);
//   }

//   if (sort) {
//     const sortList = sort
//       .split(',')
//       .map((field) =>
//         field.startsWith('-') ? `${field.slice(1)} DESC :` : field
//       )
//       .join(',');
//     queryString += ` ORDER by ${sortList}`;
//   }

//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limmit) || 10;
//   const offset = (page - 1) * limit;

//   queryString += ` limit $${parameters.length + 1} OFFSET $${
//     parameters.length + 2
//   }`;
//   parameters.push(limit, offset);
//   console.log(queryString);

//   const { rows } = await db.query(queryString, parameters);

//   res.status(200).send({ plants: rows, nbHits: getAllPlants.length });
// };

const getAllPlants = async (req, res) => {
  const { rows: plants } = await db.query('select * from plants');

  res.status(StatusCodes.OK).json({ plants });
};

//*un seul plant
const getSinglePlant = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const {
    rows: [plant],
  } = await db.query('SELECT * FROM plants where plant_id = $1', [id]);
  res.status(StatusCodes.OK).json({ plant });
};

module.exports = {
  getAllPlants,
  getAllPlantsStatic,
  getSinglePlant,
};
