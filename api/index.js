import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouters from './routes/userRoutes.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js';
import appVersionRouter from './routes/appVersionRoute.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


mongoose.connect(process.env.MongoDB).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

const __dirname = path.resolve();


app.listen(process.env.PORT || 3000, ()=>{
    console.log('Server is running on port 3000!');
});

app.use("/api/user", userRouters);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api", appVersionRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

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