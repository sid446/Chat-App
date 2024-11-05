import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApiError } from './utils/ApiError.js';
import userRouter from './routes/user.routes.js';
import { Server } from 'socket.io';
import http from 'http';
import connectDB from './db/index.js';
import { handleDisconnect, handleLogin, handleSending } from './controllers/socket.controller.js';

dotenv.config({ path: './.env' });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});


export {io}
// Database connection
connectDB()
    .then(() => {
        server.listen(process.env.PORT || 7000, () => {
            console.log(`Server is running on port: ${process.env.PORT || 7000}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed", err);
    });

// Middleware setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.post("/", (req, res) => {
    res.send("hi");
});
app.use("/api/v1/users", userRouter);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('login', (email) =>handleLogin(socket,email));

    socket.on('sendMessage', ({ recipient, content }) => handleSending(io,socket,recipient,content));
    

    socket.on('disconnect', () =>handleDisconnect(socket));
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

export { app };
