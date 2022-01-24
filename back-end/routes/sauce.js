const express = require('express');
//Router Express permet de créer des routeurs séparés pour chaque route principale de votre application
const router = express.Router();
//Vérifie qu'un utilisateur est bien identifié
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

//Attribution des fonctions du controller aux routes
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeDislikeSauce);

module.exports = router;