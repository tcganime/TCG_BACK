import express from 'express';

// Routers
import userRouter from './user/user.routes';
import cardRouter from './card/card.routes';

const app = express();

app.use('/user', userRouter);
app.use('/card', cardRouter);

export default app;