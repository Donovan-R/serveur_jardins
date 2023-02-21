const { StatusCodes } = require('http-status-codes');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../errors');

const getUsers = async (req, res) => {
  const { rows: data } = await db.query('select * from users');
  res.status(StatusCodes.OK).json({ data });
};

module.exports = {
  getUsers,
};
