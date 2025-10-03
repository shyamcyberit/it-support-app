import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import requestRoutes from './routes/request';
import userRoutes from './routes/user';
import adminRoutes from './routes/admin';
const app = express();
app.use(cors());
app.use(express.json());
// Public / auth routes
app.use('/api/auth', authRoutes);
// Core feature routes
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
// Admin routes (requests & users)
app.use('/api/admin', adminRoutes);
// Root endpoint
app.get('/', (req, res) => {
    res.send('IT Support Service Management API');
});
// Handle unmatched API routes for easier debugging
app.use('/api/*', (req, res) => {
    console.warn(`⚠️   Unmatched route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Not found', path: req.originalUrl });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
