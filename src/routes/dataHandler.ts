import { Router } from 'express';
import { DataHandlerController } from '../controllers/dataHandlerController';

const router = Router();
const dataHandlerController = new DataHandlerController();

router.post('/incoming_data', (req, res) => dataHandlerController.handleIncomingData(req, res));

export default router;
