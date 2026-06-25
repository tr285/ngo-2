const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (env.isDevelopment) {
  app.use(morgan('dev'));
}

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NGO Management API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
