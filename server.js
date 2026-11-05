require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const seedDatabase = require('./seed');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const noticesRoutes = require('./routes/notices');
const facultyRoutes = require('./routes/faculty');
const galleryRoutes = require('./routes/gallery');
const uploadRoutes = require('./routes/upload');
const enquiriesRoutes = require('./routes/enquiries');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '200kb' }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', school: 'PHS' }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/notices', noticesRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/enquiries', enquiriesRoutes);

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production' || process.env.SERVE_STATIC === 'true') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((req, res) => res.status(404).json({ error: 'API endpoint not found' }));
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

connectDB()
  .then( () => {
    app.listen(PORT, () => {
      console.log('');
      console.log('========================================');
      console.log('  PHS School API (MERN Backend)');
      console.log('========================================');
      console.log(`  API     : http://localhost:${PORT}`);
      console.log(`  Uploads : http://localhost:${PORT}/uploads`);
      console.log(`  CORS    : ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log('========================================');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.error('Set MONGODB_URI in .env (local MongoDB or Atlas)');
    process.exit(1);
  });
