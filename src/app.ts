import express from 'express';
import Routes from './routes/routes';

const app = express();

app.use(express.json());

app.use(Routes);

export default app;
