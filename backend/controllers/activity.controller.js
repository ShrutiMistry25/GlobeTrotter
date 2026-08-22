const activityModel = require('../models/activity.model');
const asyncHandler = require('../utils/asyncHandler');

exports.searchActivities = asyncHandler(async (req, res) => {
  const activities = await activityModel.searchActivities({
    cityId: req.query.cityId,
    category: req.query.category,
    maxCost: req.query.maxCost,
    maxDuration: req.query.maxDuration,
    q: req.query.q
  });
  res.json({ count: activities.length, activities });
});

exports.getActivity = asyncHandler(async (req, res) => {
  const activity = await activityModel.getActivityById(Number(req.params.id));
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  res.json({ activity });
});
