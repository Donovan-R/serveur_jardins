const { StatusCodes } = require('http-status-codes');
const db = require('../db');
const { BadRequestError, NotFoundError } = require('../errors');

const getUserInfos = async (req, res) => {
  const { userID } = req.user;
  const { rows: user } = await db.query(
    'select * from users where user_id= $1',
    [userID]
  );

  res.status(StatusCodes.OK).json({ user });
};

const updateUserInfos = async (req, res) => {
  const {
    userInfos: { lastname, firstname, mobile, email },
  } = req.body;

  if (!firstname || firstname.length < 3 || firstname.length > 50) {
    throw new BadRequestError(
      'Veuillez fournir un prénom valide entre 3 et 50 caractères'
    );
  }

  if (!lastname || lastname.length < 3 || lastname.length > 50) {
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

  const { userID } = req.user;
  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET lastname = $1, firstname = $2, mobile = $3, email = $4 WHERE user_id = $5 RETURNING *',
    [lastname, firstname, mobile, email, userID]
  );
  res.status(StatusCodes.OK).json({ user });
};

module.exports = {
  getUserInfos,
  updateUserInfos,
};
