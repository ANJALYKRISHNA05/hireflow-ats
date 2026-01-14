import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Backend is working perfectly!',
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});



export default app;