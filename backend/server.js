// import express from'express';
// import cors from 'cors';
// import 'dotenv/config';
// import connectDB from './config/db.js';
// import connectCloudinary from './config/cloudinary.js';
//  //import adminRouter from './routes/adminRoute.js';
// import userRouter from './routes/userRoute.js';
// import mlaRouter from './routes/mlaRoute.js';
// import { clerkAuth} from './middlewares/authUser.js';
// //app config
// const app = express();
// const port = process.env.PORT || 8000;
// connectDB();
// connectCloudinary();
// //middleware
// app.use(express.json());
// app.use(cors());
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb', extended: true}));
// app.use(clerkAuth); // Apply Clerk authentication middleware globally

// //api endpoints
// //app.use('/api/admin', adminRouter)
// app.use('/api/user', userRouter)
// app.use('/api/mla', mlaRouter);



// app.get('/', (req, res) => {
//     res.status(200).send('Hello World')
// });

// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`)
// })


//new code
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import mlaRouter from './routes/mlaRoute.js';
import { clerkAuth } from './middlewares/authUser.js';
import notificationRouter from './routes/notificationRoute.js';
import { clerkMiddleware } from '@clerk/express';

//app config
const app = express();
const port = process.env.PORT || 8000;

// Create HTTP server and Socket.IO instance
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"], // Your frontend URLs
    methods: ["GET", "POST"],
    credentials: true
  }
});

connectDB();
connectCloudinary();

//middleware
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
})); // ✅ Proper CORS config

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(clerkAuth); // Apply Clerk authentication middleware globally

// Use Clerk's middleware for authentication
app.use(clerkMiddleware()); // Apply Clerk middleware for authentication

// Make Socket.IO available to routes
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join proposal room for real-time comments
  socket.on('join_proposal', (proposalId) => {
    socket.join(`proposal_${proposalId}`);
    console.log(`User ${socket.id} joined proposal room: ${proposalId}`);
  });
  
  // Leave proposal room
  socket.on('leave_proposal', (proposalId) => {
    socket.leave(`proposal_${proposalId}`);
    console.log(`User ${socket.id} left proposal room: ${proposalId}`);
  });
  
  // Join user notification room
  socket.on('join_user_notifications', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${socket.id} joined notification room: ${userId}`);
  });
  
  // Leave user notification room
  socket.on('leave_user_notifications', (userId) => {
    socket.leave(`user_${userId}`);
    console.log(`User ${socket.id} left notification room: ${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
//api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/mla', mlaRouter);


// Add this route with your other API endpoints
app.use('/api/notifications', notificationRouter);

app.get('/', (req, res) => {
    res.status(200).send('Hello World')
});

// Use server.listen instead of app.listen
server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
