const express = require('express');
const router = express.Router();

const {
  getAllPlants,
  getAllPlantsStatic,
  getSinglePlant,
} = require('../controllers/plants.js');

router.route('/').get(getAllPlants);
router.route('/:id').get(getSinglePlant);
router.route('/static').get(getAllPlantsStatic);

module.exports = router;
