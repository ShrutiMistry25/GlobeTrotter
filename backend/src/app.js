const express = require('express');

const apiRoutes = require('../routes');

const app = express();

app.use(express.json({ limit: '2mb' }));

app.use((req, res, next) => {
  const origin = process.env.CLIENT_URL;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));
}

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'globetrotter-api' }));
app.use('/api', apiRoutes);

app.use((req, res) => res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` }));

app.use(require('../middleware/errorHandler'));

module.exports = app;
