import express from 'express';
const router = express.Router({ strict: true });
import home from './home.js';
import chat from './chat.js';

router.get('/home', home);
router.post('/chat', chat);

export default router;