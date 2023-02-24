const { StatusCodes } = require('http-status-codes');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../errors');

const getUsers = async (req, res) => {
  const { rows: data } = await db.query(
    'SELECT * from users INNER JOIN roles ON roles.role_id = users.role_id'
  );
  res.status(StatusCodes.OK).json({ data });
};

const deleteUser = async (req, res) => {
  const { id: userID } = req.params;

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

  if (!firstname || firstname.length < 2 || firstname.length > 50) {
    throw new BadRequestError(
      'Veuillez fournir un prénom valide entre 3 et 50 caractères'
    );
  }

  if (!lastname || lastname.length < 2 || lastname.length > 50) {
    throw new BadRequestError(
      'Veuillez fournir un nom valide entre 3 et 50 caractères'
    );
  }

  const isValidEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  if (!email || !isValidEmail) {
    throw new BadRequestError('Veuillez fournir un email valide');
  }

  const isValideTel = /^(0[1-68])(?:[ _.-]?(\d{2})){4}$/.test(mobile);

  if (!mobile || !isValideTel) {
    throw new BadRequestError(
      'veuillez indiquer un numéro de téléphone valide'
    );
  }

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
