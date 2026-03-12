 const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const controller = require('../controllers/horarios.controller');

//http://localhost:3000/api/horarios/  metodos: post nuevo horario
//http://localhost:3000/api/horarios/materia/id  metodos: getconsultar horarios de una materia
//http://localhost:3000/api/horarios/  metodos: get consultar horario completo del usuario
//http://localhost:3000/api/horarios/id  metodos: put actualizar horario
//http://localhost:3000/api/horarios/id  metodos: delete eliminar horario


router.post('/', verificarToken, controller.crearHorario);
router.get('/materia/:id_materia', verificarToken, controller.obtenerHorariosPorMateria);
router.get('/', verificarToken, controller.obtenerHorarioCompleto);
router.put('/:id', verificarToken, controller.actualizarHorario);
router.delete('/:id', verificarToken, controller.eliminarHorario);

module.exports = router;
