import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { generateRoute } from './routes/generate';
import { replanRoute } from './routes/replan';
import { logger } from './utils/logger';
import { validateTripSetup, validateReplanInput } from './middleware/validation';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security Middleware ────────────────────────────────────────────────
/** Helmet sets secure HTTP headers (XSS, clickjacking, MIME sniffing protection) */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://maps.googleapis.com"],
    },
  },
}));

/** CORS configuration — restrict origins in production */
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.ALLOWED_ORIGIN || '*']
    : '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

/** Rate limiting — prevent API abuse */
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute window
  max: 20,                    // max 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

// ─── Performance Middleware ─────────────────────────────────────────────
/** Gzip compression for all responses */
app.use(compression());

/** Parse JSON body with size limit to prevent payload attacks */
app.use(express.json({ limit: '1mb' }));

// ─── Health Check ───────────────────────────────────────────────────────
/** Health endpoint for Cloud Run readiness/liveness probes */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────
app.post('/api/generate', apiLimiter, validateTripSetup, generateRoute);
app.post('/api/replan', apiLimiter, validateReplanInput, replanRoute);

// ─── Global Error Handler ───────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── Static Files (Production) ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '..', 'public');

  /** Serve static assets with cache headers for performance */
  app.use(express.static(clientPath, {
    maxAge: '1d',
    etag: true,
  }));

  /** SPA fallback — serve index.html for client-side routing */
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  logger.info(`TripPulse API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

export default app;
