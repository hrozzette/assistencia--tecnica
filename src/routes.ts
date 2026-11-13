
import { Router } from 'express';
import UsuarioController from './controller/UsuarioController.js';
import ClienteController from './controller/ClienteController.js';
import EquipamentoController from './controller/EquipamentoController.js';
import AgendamentoController from './controller/AgendamentoController.js';

const router = Router();

router.post('/login', UsuarioController.login);

router.use(UsuarioController.verificarToken);

router.get('/clientes', ClienteController.listar);
router.get('/clientes/buscar', ClienteController.buscar);
router.post('/clientes', ClienteController.cadastrar);
router.put('/clientes/:id', ClienteController.editar);
router.delete('/clientes/:id', ClienteController.excluir);

router.get('/equipamentos', EquipamentoController.listar);
router.get('/equipamentos/buscar', EquipamentoController.buscar);
router.post('/equipamentos', EquipamentoController.cadastrar);
router.put('/equipamentos/:id', EquipamentoController.editar);
router.delete('/equipamentos/:id', EquipamentoController.excluir);

router.get('/agendamentos', AgendamentoController.listar);
router.put('/agendamentos/:id', AgendamentoController.atualizarData);

export default router;
