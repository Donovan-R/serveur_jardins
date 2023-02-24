const express = require('express');
const router = express.Router();

const {
  getUserInfos,
  updateUserInfos,
  updatePassword,
} = require('../controllers/account.js');

router.route('/').get(getUserInfos).put(updateUserInfos);
router.route('/:id').put(updatePassword);

module.exports = router;
