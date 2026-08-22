const shareModel = require('../models/share.model');
const asyncHandler = require('../utils/asyncHandler');

exports.getPublicTrip = asyncHandler(async (req, res) => {
  const trip = await shareModel.findPublicBySlug(req.params.slug);
  if (!trip) {
    return res.status(404).json({ error: 'This shared itinerary does not exist or is no longer public' });
  }
  res.json({ trip });
});

exports.copyPublicTrip = asyncHandler(async (req, res) => {
  const trip = await shareModel.findPublicBySlug(req.params.slug);
  if (!trip) {
    return res.status(404).json({ error: 'This shared itinerary does not exist or is no longer public' });
  }

  const newTripId = await shareModel.copyTrip(trip.id, req.user.id);
  res.status(201).json({
    message: `Trip copied to your account`,
    trip_id: newTripId
  });
});
