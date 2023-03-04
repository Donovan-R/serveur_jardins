const express = require('express');
const router = express.Router();

const {
  getAllPlants,
  getSinglePlant,
  editSinglePlantInfos,
} = require('../controllers/plants.js');

router.route('/').get(getAllPlants);
router.route('/:id').get(getSinglePlant).put(editSinglePlantInfos);

module.exports = router;
