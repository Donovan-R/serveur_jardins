const express = require('express');
const router = express.Router();

const {
  getAllPlants,
  getSinglePlant,
  editSinglePlantInfos,
  addPlant,
} = require('../controllers/plants.js');

router.route('/').get(getAllPlants).post(addPlant);
router.route('/:id').get(getSinglePlant).put(editSinglePlantInfos);

module.exports = router;
