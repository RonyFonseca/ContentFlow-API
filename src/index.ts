import express from 'express'; 
import cors from 'cors'; 

import userRouter from './Router/userRouter.js';
import postRouter from './Router/postRouter.js'; 
import dashboardRouter from './Router/dashboardRouter.js'; 

import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  credentials: true
}));

app.use(express.json());


app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', dashboardRouter);




app.listen(5000, () => {
  console.log("Servidor rodando em http://localhost:5000");
});