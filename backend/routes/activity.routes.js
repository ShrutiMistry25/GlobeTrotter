const router = require('express').Router();
const { query } = require('express-validator');
const activityController = require('../controllers/activity.controller');
const validate = require('../middleware/validate');

router.get(
  '/',
  [
    query('cityId').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Invalid cityId'),
    query('maxCost').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('maxCost must be a positive number'),
    query('maxDuration').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('maxDuration must be a positive number')
  ],
  validate,
  activityController.searchActivities
);
router.get('/:id', activityController.getActivity);

module.exports = router;
