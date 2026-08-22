const tripModel = require('../models/trip.model');
const asyncHandler = require('../utils/asyncHandler');

async function getOwnedTrip(req) {
  const trip = await tripModel.getTripBase(Number(req.params.id));
  if (!trip || trip.user_id !== req.user.id) return null;
  return trip;
}

function notFound(res, what = 'Trip') {
  return res.status(404).json({ error: `${what} not found` });
}

exports.listTrips = asyncHandler(async (req, res) => {
  const trips = await tripModel.listTripsByUser(req.user.id);
  res.json({ count: trips.length, trips });
});

exports.createTrip = asyncHandler(async (req, res) => {
  const { name, description, cover_image_url, start_date, end_date, status, budget_total } = req.body;
  const trip = await tripModel.createTrip({
    user_id: req.user.id,
    name,
    description,
    cover_image_url,
    start_date,
    end_date,
    status,
    budget_total
  });
  res.status(201).json({ message: 'Trip created', trip });
});

exports.getTrip = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  res.json(await tripModel.getTripDetail(owned.id));
});

exports.updateTrip = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  const trip = await tripModel.updateTrip(owned.id, req.body);
  res.json({ message: 'Trip updated', trip });
});

exports.deleteTrip = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  await tripModel.deleteTrip(owned.id);
  res.json({ message: 'Trip deleted' });
});

exports.addStop = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  const stopId = await tripModel.addStop(owned.id, req.body);
  const stop = await tripModel.getStopById(stopId);
  res.status(201).json({ message: 'Stop added', stop });
});

exports.updateStop = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const stop = await tripModel.getStopById(Number(req.params.stopId));
  if (!stop || stop.trip_id !== owned.id) return notFound(res, 'Stop');

  const updated = await tripModel.updateStop(stop.id, req.body);
  res.json({ message: 'Stop updated', stop: updated });
});

exports.deleteStop = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const stop = await tripModel.getStopById(Number(req.params.stopId));
  if (!stop || stop.trip_id !== owned.id) return notFound(res, 'Stop');

  await tripModel.deleteStop(stop.id);
  res.json({ message: 'Stop removed' });
});

exports.reorderStops = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const { stopIds } = req.body;
  if (!Array.isArray(stopIds) || !stopIds.length) {
    return res.status(400).json({ error: 'stopIds array is required' });
  }

  await tripModel.reorderStops(owned.id, stopIds.map(Number));
  const stops = await tripModel.getStops(owned.id);
  res.json({ message: 'Stops reordered', stops });
});

exports.addActivity = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const stop = await tripModel.getStopById(Number(req.params.stopId));
  if (!stop || stop.trip_id !== owned.id) return notFound(res, 'Stop');

  if (!req.body.activity_id && !String(req.body.title || '').trim()) {
    return res.status(400).json({ error: 'Provide an activity_id from the catalog or a custom title' });
  }

  const activityId = await tripModel.addStopActivity(stop.id, req.body);
  const activity = await tripModel.getActivityById(activityId);
  res.status(201).json({ message: 'Activity added to itinerary', activity });
});

async function getOwnedActivity(req) {
  const activity = await tripModel.getActivityById(Number(req.params.activityId));
  if (!activity) return null;
  const stop = await tripModel.getStopById(activity.stop_id);
  if (!stop || stop.trip_id !== Number(req.params.id)) return null;
  return { activity, stop };
}

exports.updateActivity = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const found = await getOwnedActivity(req);
  if (!found) return notFound(res, 'Itinerary activity');

  const updated = await tripModel.updateStopActivity(found.activity.id, req.body);
  res.json({ message: 'Activity updated', activity: updated });
});

exports.deleteActivity = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const found = await getOwnedActivity(req);
  if (!found) return notFound(res, 'Itinerary activity');

  await tripModel.deleteStopActivity(found.activity.id);
  res.json({ message: 'Activity removed' });
});

exports.reorderActivities = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const stop = await tripModel.getStopById(Number(req.params.stopId));
  if (!stop || stop.trip_id !== owned.id) return notFound(res, 'Stop');

  const { activityIds } = req.body;
  if (!Array.isArray(activityIds) || !activityIds.length) {
    return res.status(400).json({ error: 'activityIds array is required' });
  }

  await tripModel.reorderStopActivities(stop.id, activityIds.map(Number));
  const activities = (await tripModel.getActivities(owned.id)).filter((a) => a.stop_id === stop.id);
  res.json({ message: 'Activities reordered', activities });
});

exports.getBudget = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const detail = await tripModel.getTripDetail(owned.id);
  const budget = tripModel.buildBudget(detail.trip, detail.stops, detail.activities_flat, detail.expenses);
  res.json({
    trip: { id: detail.trip.id, name: detail.trip.name, start_date: detail.trip.start_date, end_date: detail.trip.end_date },
    ...budget
  });
});

exports.listExpenses = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  const expenses = await tripModel.getExpenses(owned.id);
  res.json({ count: expenses.length, expenses });
});

exports.addExpense = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  const expense = await tripModel.addExpense(owned.id, req.body);
  res.status(201).json({ message: 'Expense added', expense });
});

exports.updateExpense = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const existing = await tripModel.getExpenseById(Number(req.params.expenseId));
  if (!existing || existing.trip_id !== owned.id) return notFound(res, 'Expense');

  const expense = await tripModel.updateExpense(existing.id, req.body);
  res.json({ message: 'Expense updated', expense });
});

exports.deleteExpense = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const expenses = await tripModel.getExpenses(owned.id);
  const expense = expenses.find((e) => e.id === Number(req.params.expenseId));
  if (!expense) return notFound(res, 'Expense');

  await tripModel.deleteExpense(expense.id);
  res.json({ message: 'Expense deleted' });
});

exports.enableShare = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);

  const slug = owned.share_slug || require('../utils/tokens').generateSlug();
  await tripModel.enableShare(owned.id, slug);
  res.json({
    message: 'Public link enabled',
    share_slug: slug,
    share_url: `/share/${slug}`
  });
});

exports.disableShare = asyncHandler(async (req, res) => {
  const owned = await getOwnedTrip(req);
  if (!owned) return notFound(res);
  await tripModel.disableShare(owned.id);
  res.json({ message: 'Public link disabled' });
});
