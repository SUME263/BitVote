require('dotenv').config();


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimiter = require('./rateLimiter');
const authRoutes = require('./auth');
const voteRoutes = require('./vote');
const adminRoutes = require('./admin');

//Checking if environment variables are loaded
console.log('Enviroment check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded' : 'Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Loaded' : 'Missing');
console.log('PORT:', process.env.PORT || '3000 (default)');

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
    // console.log(`Blockchain integration: ${process.env.BLOCKCHAIN_ENABLED === 'true' ? 'ENABLED' : 'DISABLED (using Supabase only)'}`);
});