import express from 'express';
import { signup, signin, google, signout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/signout', signout);
router.post('/google', google);

export default router;