const express = require('express');
const router = express.Router();

const {
  getUserInfos,
  updateUserInfos,
  updatePassword,
  deleteAccount,
} = require('../controllers/account.js');

router.route('/').get(getUserInfos).put(updateUserInfos).delete(deleteAccount);
router.route('/:id').put(updatePassword);

module.exports = router;
