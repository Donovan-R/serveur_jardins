const { UnauthentificatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthentificatedError('identification non valide');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //attache l'utilisateur
    req.user = {
      userID: payload.userID,
      name: payload.name,
    };

    next();
  } catch (error) {
    throw new UnauthentificatedError('identification invalide');
  }
};

module.exports = auth;
