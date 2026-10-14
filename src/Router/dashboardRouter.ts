import express from 'express';
import dashController from '../Controller/dashController.js';

const router = express.Router();
const dashInstance = new dashController();

//gerarResumo e calcularPostsPorStatus
router.get('/dashboard/summary', dashInstance.gerarResumo);

export default router;