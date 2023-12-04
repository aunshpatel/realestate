import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouters from './routes/userRoutes.js';

dotenv.config();
const app=express();
mongoose.connect(process.env.MongoDB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!');
});

app.use("/api/user", userRouters);
