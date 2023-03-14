const express = require('express');
const router = express.Router();

const {
  getAllPlants,
  getSinglePlant,
  editSinglePlantInfos,
  addPlant,
  deleteSinglePlant,
} = require('../controllers/plants.js');

router.route('/').get(getAllPlants).post(addPlant);
router
  .route('/:id')
  .get(getSinglePlant)
  .put(editSinglePlantInfos)
  .delete(deleteSinglePlant);

module.exports = router;
