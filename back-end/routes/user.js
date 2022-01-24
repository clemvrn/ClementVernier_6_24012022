const express = require('express');
const router = express.Router();
//Importation du package password-validator
const passwordValidator = require("../middleware/password-validator")

const userCtrl = require('../controllers/user');

//on applique le package sur la route d'inscription
router.post('/signup', passwordValidator, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;