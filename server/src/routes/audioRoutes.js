import express from 'express';
import * as audioController from '../controllers/audioController.js';

const router = express.Router();

router.post('/transcribe/test', audioController.transcribeAudioTeste);

export default router;
