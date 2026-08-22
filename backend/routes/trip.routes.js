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
router.put(
  '/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Trip name cannot be empty'),
    body('start_date').optional({ checkFalsy: true }).isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
    body('end_date')
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage('End date must be a valid date (YYYY-MM-DD)')
      .custom((value, { req }) => {
        const start = req.body.start_date || '';
        if (!start || value >= start) return true;
        throw new Error('End date must be on or after start date');
      }),
    body('status')
      .optional()
      .isIn(['draft', 'planned', 'completed'])
      .withMessage('Invalid status'),
    body('budget_total')
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage('Budget must be a positive number')
  ],
  validate,
  tripController.updateTrip
);
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

router.put(
  '/:id/stops/:stopId',
  [
    body('arrival_date').optional({ checkFalsy: true }).isISO8601().withMessage('Arrival date must be a valid date (YYYY-MM-DD)'),
    body('departure_date')
      .optional({ checkFalsy: true })
      .isISO8601()
      .withMessage('Departure date must be a valid date (YYYY-MM-DD)')
      .custom((value, { req }) => {
        const arrival = req.body.arrival_date || '';
        if (!arrival || value >= arrival) return true;
        throw new Error('Departure date must be on or after arrival date');
      }),
    body('notes').optional().trim()
  ],
  validate,
  tripController.updateStop
);
router.delete('/:id/stops/:stopId', tripController.deleteStop);

router.post(
  '/:id/stops/:stopId/activities',
  [
    body('scheduled_date').isISO8601().withMessage('Scheduled date is required (YYYY-MM-DD)'),
    body('title').optional().trim(),
    body('activity_id').optional({ checkFalsy: true }).isInt({ min: 1 }),
    body('est_cost').optional({ checkFalsy: true }).isFloat({ min: 0 }),
    body('duration_hours').optional({ checkFalsy: true }).isFloat({ min: 0, max: 24 }).withMessage('Duration must be between 0 and 24 hours'),
    body('category')
      .optional()
      .isIn(['outdoors', 'culture', 'food', 'adventure', 'relax'])
      .withMessage('Invalid activity category'),
    body('start_time').optional({ checkFalsy: true }).matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Start time must be HH:MM')
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

router.put(
  '/:id/stops/:stopId/activities/:activityId',
  [
    body('title').optional().trim().notEmpty().withMessage('Activity title cannot be empty'),
    body('scheduled_date').optional({ checkFalsy: true }).isISO8601().withMessage('Scheduled date must be a valid date (YYYY-MM-DD)'),
    body('start_time').optional({ checkFalsy: true }).matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Start time must be HH:MM'),
    body('duration_hours').optional({ checkFalsy: true }).isFloat({ min: 0, max: 24 }).withMessage('Duration must be between 0 and 24 hours'),
    body('est_cost').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number'),
    body('category')
      .optional()
      .isIn(['outdoors', 'culture', 'food', 'adventure', 'relax'])
      .withMessage('Invalid activity category')
  ],
  validate,
  tripController.updateActivity
);
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
router.put(
  '/:id/expenses/:expenseId',
  [
    body('title').optional().trim().notEmpty().withMessage('Expense title cannot be empty'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than zero'),
    body('category')
      .optional()
      .isIn(['transport', 'stay', 'meals', 'activities', 'other'])
      .withMessage('Invalid expense category'),
    body('expense_date').optional({ checkFalsy: true, nullable: true }).isISO8601().withMessage('Expense date must be a valid date (YYYY-MM-DD)')
  ],
  validate,
  tripController.updateExpense
);
router.delete('/:id/expenses/:expenseId', tripController.deleteExpense);

router.post('/:id/share', tripController.enableShare);
router.delete('/:id/share', tripController.disableShare);

module.exports = router;
