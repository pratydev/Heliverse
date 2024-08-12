import express, { Application } from 'express';
import cors from 'cors';
import indexRouter from './routes/index';
import { PrismaClient } from '@prisma/client';

const app: Application = express();

export const prisma = new PrismaClient();


app.use(cors(
    {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
))

app.use(express.json());


app.use('/', indexRouter);


app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
