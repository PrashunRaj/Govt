import express from'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
// import adminRouter from './routes/adminRoute.js';
// import userRouter from './routes/userRoute.js';

//app config
const app = express();
const port = process.env.PORT || 8000;
connectDB();
connectCloudinary();
//middleware
app.use(express.json());
app.use(cors());

//api endpoints
// app.use('/api/admin', adminRouter)
// app.use('/api/user', userRouter)


app.get('/', (req, res) => {
    res.status(200).send('Hello World')
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
