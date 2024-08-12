import express, { Application } from 'express';
import cors from 'cors';
import indexRouter from './routes/index';

const app: Application = express();

app.use(cors(
    {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
))

app.use(express.json());


app.use('/', indexRouter);


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});