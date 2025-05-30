import { Router } from 'express';
import { AccountController } from '../controllers/accountController';

const router = Router();
const accountController = new AccountController();

router.post('/', (req, res) => accountController.create(req, res));
router.get('/', (req, res) => accountController.getAll(req, res));
router.get('/:accountId', (req, res) => accountController.getById(req, res));
router.put('/:accountId', (req, res) => accountController.update(req, res));
router.delete('/:accountId', (req, res) => accountController.delete(req, res));

export default router;
