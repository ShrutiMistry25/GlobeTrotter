const router = require('express').Router();
const shareController = require('../controllers/share.controller');
const auth = require('../middleware/auth');

router.get('/:slug', shareController.getPublicTrip);
router.post('/:slug/copy', auth, shareController.copyPublicTrip);

module.exports = router;
