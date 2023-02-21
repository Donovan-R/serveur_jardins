const express = require('express');
const router = express.Router();

const { getUsers } = require('../controllers/dash.js');

router.route('/').get(getUsers);

module.exports = router;
