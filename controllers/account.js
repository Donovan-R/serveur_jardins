const { StatusCodes } = require('http-status-codes');
const db = require('../db');
const { BadRequestError, UnauthentificatedError } = require('../errors');
const bcrypt = require('bcrypt');

const getUserInfos = async (req, res) => {
  const { userID } = req.user;
  const { rows: user } = await db.query(
    'select * from users where user_id= $1',
    [userID]
  );

  res.status(StatusCodes.OK).json({ user });
};
const deleteAccount = async (req, res) => {
  const { userID } = req.user;
  const { rows: data } = await db.query(
    'DELETE FROM users WHERE user_id = $1 RETURNING *',
    [userID]
  );
  res.status(StatusCodes.OK).json({ data });
};

const updateUserInfos = async (req, res) => {
  const {
    userInfos: { lastname, firstname, mobile, email },
  } = req.body;

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

  const { userID } = req.user;
  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET lastname = $1, firstname = $2, mobile = $3, email = $4 WHERE user_id = $5 RETURNING *',
    [lastname, firstname, mobile, email, userID]
  );
  res.status(StatusCodes.OK).json({ user });
};

const updatePassword = async (req, res) => {
  const { originalPassword, newPassword } = req.body;
  const { userID } = req.user;
  if (!originalPassword) {
    throw new BadRequestError(
      `renseignez votre mot de passe initial s'il vous plait`
    );
  }

  if (!newPassword) {
    throw new BadRequestError(
      `renseignez un nouveau mot de passe s'il vous plait`
    );
  }

  const {
    rows: [user],
  } = await db.query('select * from users where user_id = $1', [userID]);

  const isPasswordCorrect = await bcrypt.compare(
    originalPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new UnauthentificatedError('mdp incorrect');
  }

  if (!newPassword || newPassword.length < 5) {
    throw new BadRequestError(
      'Veuillez fournir un mot de passe avec au moins 6 caractéres'
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const {
    rows: [password],
  } = await db.query(
    'UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *',
    [hashedPassword, userID]
  );
  res.status(StatusCodes.OK).json({ password });
};

module.exports = {
  getUserInfos,
  updateUserInfos,
  updatePassword,
  deleteAccount,
};
