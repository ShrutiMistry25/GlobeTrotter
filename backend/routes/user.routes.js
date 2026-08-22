const router = require('express').Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(auth);

router.get('/me', userController.getProfile);
router.put(
  '/me',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 100 }).withMessage('Name is too long'),
    body('avatar_url').optional({ nullable: true }).isLength({ max: 600 }).withMessage('Avatar URL is too long'),
    body('language_pref')
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage('Language preference must be at most 10 characters')
  ],
  validate,
  userController.updateProfile
);
router.delete('/me', userController.deleteAccount);

router.get('/me/saved-destinations', userController.getSavedDestinations);
router.post('/me/saved-destinations/:cityId', userController.addSavedDestination);
router.delete('/me/saved-destinations/:cityId', userController.removeSavedDestination);

module.exports = router;
