const router = require('express').Router();

// validators
const validate = require('../controllers/middleware/validateRequest');

// validations
const authValidations = require('./validations/auth');

// controllers
const userController = require('../controllers/userController');

// routes
router.post('/register', validate(authValidations.register), userController.register);
router.post('/login', validate(authValidations.login), userController.login);

module.exports = router;
