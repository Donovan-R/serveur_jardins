const express = require('express');
const router = express.Router();

const { getUsers, deleteUser, editUser } = require('../controllers/dash.js');

router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser).put(editUser);

module.exports = router;
