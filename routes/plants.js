const express = require('express');
const router = express.Router();

const { getAllPlants, getSinglePlant } = require('../controllers/plants.js');

router.route('/').get(getAllPlants);
router.route('/:id').get(getSinglePlant);

module.exports = router;
