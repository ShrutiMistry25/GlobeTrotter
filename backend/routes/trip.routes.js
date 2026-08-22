const router = require('express').Router();
const { body } = require('express-validator');
const tripController = require('../controllers/trip.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(auth);

router.get(
  '/',
  tripController.listTrips
);

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Trip name is required'),
    body('start_date').isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
    body('end_date')
      .isISO8601()
      .withMessage('End date must be a valid date (YYYY-MM-DD)')
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.start_date)) {
          throw new Error('End date must be on or after start date');
        }
        return true;
      }),
    body('budget_total').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Budget must be a positive number')
  ],
  validate,
  tripController.createTrip
);

router.get('/:id', tripController.getTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

router.post(
  '/:id/stops',
  [
    body('city_id').isInt({ min: 1 }).withMessage('A valid city is required'),
    body('arrival_date').isISO8601().withMessage('Arrival date is required (YYYY-MM-DD)'),
    body('departure_date')
      .isISO8601()
      .withMessage('Departure date is required (YYYY-MM-DD)')
      .custom((value, { req }) => {
        if (new Date(value) < new Date(req.body.arrival_date)) {
          throw new Error('Departure date must be on or after arrival date');
        }
        return true;
      })
  ],
  validate,
  tripController.addStop
);

router.put(
  '/:id/stops/reorder',
  [body('stopIds').isArray({ min: 1 }).withMessage('stopIds array is required')],
  validate,
  tripController.reorderStops
);

router.put('/:id/stops/:stopId', tripController.updateStop);
router.delete('/:id/stops/:stopId', tripController.deleteStop);

router.post(
  '/:id/stops/:stopId/activities',
  [
    body('scheduled_date').isISO8601().withMessage('Scheduled date is required (YYYY-MM-DD)'),
    body('title').optional().trim(),
    body('activity_id').optional().isInt({ min: 1 }),
    body('est_cost').optional({ checkFalsy: true }).isFloat({ min: 0 })
  ],
  validate,
  tripController.addActivity
);

router.put(
  '/:id/stops/:stopId/activities/reorder',
  [body('activityIds').isArray({ min: 1 }).withMessage('activityIds array is required')],
  validate,
  tripController.reorderActivities
);

router.put('/:id/stops/:stopId/activities/:activityId', tripController.updateActivity);
router.delete('/:id/stops/:stopId/activities/:activityId', tripController.deleteActivity);

router.get('/:id/budget', tripController.getBudget);

router.get('/:id/expenses', tripController.listExpenses);
router.post(
  '/:id/expenses',
  [
    body('title').trim().notEmpty().withMessage('Expense title is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than zero'),
    body('category')
      .optional()
      .isIn(['transport', 'stay', 'meals', 'activities', 'other'])
      .withMessage('Invalid expense category'),
    body('expense_date').optional({ checkFalsy: true }).isISO8601()
  ],
  validate,
  tripController.addExpense
);
router.put('/:id/expenses/:expenseId', tripController.updateExpense);
router.delete('/:id/expenses/:expenseId', tripController.deleteExpense);

router.post('/:id/share', tripController.enableShare);
router.delete('/:id/share', tripController.disableShare);

module.exports = router;
