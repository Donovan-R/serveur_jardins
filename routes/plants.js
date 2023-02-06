const express = require('express');
const router = express.Router();

const {
  getAllPlants,
  getAllPlantsStatic,
} = require('../controllers/plants.js');

router.route('/').get(getAllPlants);
router.route('/static').get(getAllPlantsStatic);

module.exports = router;
