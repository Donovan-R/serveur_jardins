const express = require('express');
const router = express.Router();

const { getUserInfos, updateUserInfos } = require('../controllers/account.js');

router.route('/').get(getUserInfos).put(updateUserInfos);

module.exports = router;
