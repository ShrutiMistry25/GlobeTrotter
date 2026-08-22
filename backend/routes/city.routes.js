const router = require('express').Router();
const cityController = require('../controllers/city.controller');

router.get('/', cityController.searchCities);
router.get('/regions', cityController.getRegions);
router.get('/top', cityController.getTopCities);
router.get('/:id', cityController.getCity);

module.exports = router;
