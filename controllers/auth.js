const { BadRequestError, UnauthentificatedError } = require('../errors');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const { firstname, lastname, mobile, email, password } = req.body;

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

  const isValidetel=

  if (!password || password.length < 6) {
    throw new BadRequestError(
      'Veuillez fournir un mot de passe avec au moins 6 caractéres'
    );
  }

  // crypte le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // insère l'utilisateur
  const {
    rows: [user],
  } = await db.query(
    'INSERT INTO users (firstname, lastname, mobile, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [firstname, lastname, mobile, email, hashedPassword]
  );

  // génère un token qui va permettre de retrouver les infos de l'user
  const token = jwt.sign(
    { userID: user.user_id, name: `${user.firstname} ${user.lastname}` },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.CREATED).json({
    user: {
      name: `${user.firstname} ${user.lastname}`,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('fournir un email valide');
  }

  const {
    rows: [user],
  } = await db.query('select * from users where email = $1', [email]);

  if (!user) {
    throw new UnauthentificatedError('id incorrects');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthentificatedError('mdp incorrect');
  }

  const token = jwt.sign(
    { userID: user.user_id, name: `${user.firstname} ${user.lastname}` },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ user: { name: `${user.firstname} ${user.lastname}` }, token });
};

module.exports = { register, login };
