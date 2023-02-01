const CustomError = require('./custom-error.js');
const BadRequestError = require('./badrequest.js');
const UnauthentificatedError = require('./unauthentificated.js');

const NotFoundError = require('./not-found.js');
module.exports = {
  BadRequestError,
  UnauthentificatedError,
  CustomError,
  NotFoundError,
};
