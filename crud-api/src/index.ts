import express from 'express';
import {UserRouter} from './app/route/users';

const app = express();
app.use(express.json());

const userRouter = new UserRouter();
app.use('/api/users', userRouter.router);

app.listen(3000, () => console.log('Server running on port 3000'));

export default app;
