// const CustomError = require('../errors/custom-error.js');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  let customError = {
    // valeurs par défaut
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'il y a eu une erreur, veuillez réessayer plus tard',
  };

  // si l'email est dupliqué
  if (err.code && err.code === '23505') {
    customError.msg = `identifiant déjà utilisé`;
    customError.statusCode = 400;
  }
  res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandler;
