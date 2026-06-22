const router = require('express').Router();
const controller = require('../controllers/bookingController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

// Colaborador — sus propias reservas
router.get('/mine',    verifyToken,              controller.getMine);
router.post('/',       verifyToken,              controller.create);
router.delete('/:id',  verifyToken,              controller.cancel);

// Admin — dashboard del día
router.get('/today',   verifyToken, verifyAdmin, controller.getToday);

module.exports = router;