const cityModel = require('../models/city.model');
const asyncHandler = require('../utils/asyncHandler');

exports.searchCities = asyncHandler(async (req, res) => {
  const cities = await cityModel.searchCities({
    q: req.query.q,
    region: req.query.region,
    sort: req.query.sort
  });
  res.json({ count: cities.length, cities });
});

exports.getCity = asyncHandler(async (req, res) => {
  const city = await cityModel.getCityById(Number(req.params.id));
  if (!city) return res.status(404).json({ error: 'City not found' });
  res.json({ city });
});

exports.getRegions = asyncHandler(async (req, res) => {
  const regions = await cityModel.listRegions();
  res.json({ regions });
});

exports.getTopCities = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 6, 20);
  const cities = await cityModel.topCities(limit);
  res.json({ count: cities.length, cities });
});
