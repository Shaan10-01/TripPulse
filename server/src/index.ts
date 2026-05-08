import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { generateRoute } from './routes/generate';
import { replanRoute } from './routes/replan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate', generateRoute);
app.post('/api/replan', replanRoute);

// Serve static client in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '..', 'public');
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 TripPulse API running on port ${PORT}`);
});

export default app;
