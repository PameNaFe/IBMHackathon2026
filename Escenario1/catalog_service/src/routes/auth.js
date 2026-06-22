const router = require('express').Router();
const authController = require('../controllers/authController');

// Ruta pública — no necesita token
router.post('/login', authController.login);

module.exports = router;