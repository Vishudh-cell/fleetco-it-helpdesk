require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helpdeskRoutes = require('./routes/helpdesk');
const { initRetrievalIndex } = require('./services/retrieval');
const { getDatabase } = require('./db/database');
const { logInfo, logError } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
try {
  getDatabase();
  logInfo('SQLite database initialized successfully.');
} catch (err) {
  logError('Failed to initialize SQLite database:', err);
}

// Initialize retrieval index on boot
try {
  initRetrievalIndex();
  logInfo('Retrieval index ready.');
} catch (err) {
  logError('Failed to initialize retrieval index:', err);
}

// Mount routes at root level: POST /ask, POST /escalate, GET /health
app.use('/', helpdeskRoutes);
// Also mount under /api for proxy compatibility
app.use('/api', helpdeskRoutes);

// If client build exists, serve it statically
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

// Fallback to client index.html for SPA routes
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const indexHtml = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  return res.status(200).send('FleetCo IT Helpdesk API is running. Start the React frontend or run npm run build.');
});

if (require.main === module) {
  app.listen(PORT, () => {
    logInfo(`🚀 FleetCo IT Helpdesk Server running on http://localhost:${PORT}`);
    logInfo(`Endpoints:`);
    logInfo(`  - POST http://localhost:${PORT}/ask`);
    logInfo(`  - POST http://localhost:${PORT}/escalate`);
    logInfo(`  - GET  http://localhost:${PORT}/health`);
    logInfo(`  - GET  http://localhost:${PORT}/interactions`);
    logInfo(`  - GET  http://localhost:${PORT}/escalations`);
    logInfo(`  - GET  http://localhost:${PORT}/kb`);
  });
}

module.exports = app;
