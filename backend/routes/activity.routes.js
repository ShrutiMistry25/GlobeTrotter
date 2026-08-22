const router = require('express').Router();
const activityController = require('../controllers/activity.controller');

router.get('/', activityController.searchActivities);
router.get('/:id', activityController.getActivity);

module.exports = router;
