const { StatusCodes } = require('http-status-codes');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../errors');

const getUsers = async (req, res) => {
  const { rows: data } = await db.query('select * from users');
  res.status(StatusCodes.OK).json({ data });
};

const deleteUser = async (req, res) => {
  const { id: userID } = req.params;
  console.log(userID);
  const { rows: data } = await db.query(
    'DELETE FROM users WHERE user_id = $1 RETURNING *',
    [userID]
  );
  res.status(StatusCodes.OK).json({ data });
};

const editUser = async (req, res) => {
  const {
    userToEdit: { lastname, firstname, mobile, email, role_id },
  } = req.body;
  const { id } = req.params;
  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET lastname = $1, firstname = $2, mobile = $3, email = $4, role_id =$5 WHERE user_id = $6 RETURNING *',
    [lastname, firstname, mobile, email, role_id, id]
  );
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getUsers,
  deleteUser,
  editUser,
};
