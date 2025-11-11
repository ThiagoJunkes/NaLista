import express from 'express';
import * as itemController from '../controllers/itemController.js';

const router = express.Router();

router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

export default router;



