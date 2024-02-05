import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouters from './routes/userRoutes.js';
import authRouter  from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MongoDB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000!');
});

app.use("/api/user", userRouters);
app.use("/api/auth", authRouter);

//Middleware for error message
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});