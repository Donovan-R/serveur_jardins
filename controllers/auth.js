const { BadRequestError, UnauthentificatedError } = require('../errors');
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const register = async (req, res) => {
  const { lastname, firstname, mobile, email, password, comments, agree } =
    req.body;

  if (agree === 'false') {
    throw new BadRequestError('veuillez accepter le règlement intérieur');
  }

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

  if (!password || password.length < 5) {
    throw new BadRequestError(
      'Veuillez fournir un mot de passe avec au moins 6 caractéres'
    );
  }

  if (!req.files) {
    throw new BadRequestError('veuillez fournir un justificatif');
  }

  const { justificatif } = req.files;

  if (
    !justificatif.mimetype.startsWith('application/pdf') &&
    !justificatif.mimetype.startsWith('image')
  ) {
    throw new BadRequestError('veuillez charger un fichier PDF ou une image');
  }

  const maxSize = 1024 * 1024; //10 Mb
  if (justificatif.size > maxSize) {
    throw new BadRequestError(
      'veuillez charger un document inférieure à 10 Mb'
    );
  }

  const result = await cloudinary.uploader.upload(justificatif.tempFilePath, {
    use_filename: true,
    folder: 'jardins_plants/justificatifs',
  });

  //* suppression du fichier temp
  fs.unlinkSync(justificatif.tempFilePath);

  // crypte le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // insère l'utilisateur
  const {
    rows: [user],
  } = await db.query(
    'INSERT INTO users (lastname, firstname, mobile, email, password, justificatif, comments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [
      lastname,
      firstname,
      mobile,
      email,
      hashedPassword,
      result.secure_url,
      comments,
    ]
  );

  res.status(StatusCodes.CREATED).json(user);
};

//* login

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('identifiant ou mot de passe incorrect');
  }

  const {
    rows: [user],
  } = await db.query('select * from users where email = $1', [email]);

  if (!user) {
    throw new UnauthentificatedError('identifiant incorrect');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new UnauthentificatedError('mot de passe incorrect');
  }

  const token = jwt.sign(
    { userID: user.user_id, name: user.firstname },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(StatusCodes.OK).json({
    user: { name: user.firstname, role: user.role_id, email: user.email },
    token,
  });
};

module.exports = { register, login };
