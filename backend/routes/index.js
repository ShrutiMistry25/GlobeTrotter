const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/cities', require('./city.routes'));
router.use('/activities', require('./activity.routes'));
router.use('/trips', require('./trip.routes'));
router.use('/public/trips', require('./public.routes'));

module.exports = router;
