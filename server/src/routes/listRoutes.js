import express from 'express';
import * as listController from '../controllers/listController.js';

const router = express.Router();

router.get('/', listController.getLists);
router.post('/', listController.createList);
router.get('/:id', listController.getItens);
router.put('/:id', listController.updateList);
router.delete('/:id', listController.deleteList);

export default router;