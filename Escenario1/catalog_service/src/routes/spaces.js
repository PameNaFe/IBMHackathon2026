const router = require('express').Router();
const controller = require('../controllers/spacesController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

// Rutas públicas autenticadas (cualquier rol)
router.get('/',     verifyToken,              controller.getAll);
router.get('/:id',  verifyToken,              controller.getById);

// Rutas solo Admin
router.post('/',    verifyToken, verifyAdmin, controller.create);
router.put('/:id',  verifyToken, verifyAdmin, controller.update);
router.delete('/:id', verifyToken, verifyAdmin, controller.remove);

module.exports = router;