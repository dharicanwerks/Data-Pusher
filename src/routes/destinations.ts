import { Router } from 'express';
import { DestinationController } from '../controllers/destinationController';

const router = Router();
const destinationController = new DestinationController();

router.post('/', (req, res) => destinationController.create(req, res));
router.get('/', (req, res) => destinationController.getAll(req, res));
router.get('/:id', (req, res) => destinationController.getById(req, res));
router.get('/account/:accountId', (req, res) => destinationController.getByAccountId(req, res));
router.put('/:id', (req, res) => destinationController.update(req, res));
router.delete('/:id', (req, res) => destinationController.delete(req, res));

export default router;

