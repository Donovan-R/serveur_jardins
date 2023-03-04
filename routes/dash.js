const express = require('express');
const router = express.Router();

const {
  getUsers,
  deleteUser,
  editUser,
  getSinglePlantInfos,
  editSinglePlantInfos,
} = require('../controllers/dash.js');

router.route('/').get(getUsers);
router.route('/:id').delete(deleteUser).put(editUser);
router.route('/:plant_id').get(getSinglePlantInfos);

module.exports = router;
