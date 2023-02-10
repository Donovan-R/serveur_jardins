const express = require('express');
const router = express.Router();

const { login, register } = require('../controllers/auth.js');
const { uploadJustificatif } = require('../controllers/uploadController.js');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/uploads').post(uploadJustificatif);

module.exports = router;
