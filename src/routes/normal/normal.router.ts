import express from 'express';

// Routers
import userRouter from './user/user.routes';

const app = express();

app.use('/user', userRouter);

export default app;