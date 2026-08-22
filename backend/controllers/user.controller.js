const userModel = require('../models/user.model');
const cityModel = require('../models/city.model');
const asyncHandler = require('../utils/asyncHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: userModel.sanitize(user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'avatar_url', 'language_pref'];
  const fields = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) fields[key] = req.body[key];
  }

  const updated = await userModel.updateUser(req.user.id, fields);
  res.json({ message: 'Profile updated', user: userModel.sanitize(updated) });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  await userModel.deleteUser(req.user.id);
  res.json({ message: 'Account and all associated trips deleted' });
});

exports.getSavedDestinations = asyncHandler(async (req, res) => {
  const destinations = await userModel.getSavedDestinations(req.user.id);
  res.json({ destinations });
});

exports.addSavedDestination = asyncHandler(async (req, res) => {
  const cityId = Number(req.params.cityId);
  const city = await cityModel.getCityById(cityId);
  if (!city) return res.status(404).json({ error: 'City not found' });

  await userModel.addSavedDestination(req.user.id, cityId);
  res.status(201).json({ message: `${city.name} saved to your horizons` });
});

exports.removeSavedDestination = asyncHandler(async (req, res) => {
  await userModel.removeSavedDestination(req.user.id, Number(req.params.cityId));
  res.json({ message: 'Destination removed from saved list' });
});
