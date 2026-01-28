import express from 'express';
import usersRoutes from '../users/users.routes.js';
import matchesRoutes from '../matches/matches.routes.js';
import chatsRoutes from '../chats/chats.routes.js';

const router = express.Router();

router
    .use('/users', usersRoutes)
    .use('/matches', matchesRoutes)
    .use('/chats', chatsRoutes)

export default router;