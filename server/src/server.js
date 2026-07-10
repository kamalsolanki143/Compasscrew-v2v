require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');
const { initSocket } = require('./services/socket.service');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escapeher';

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

async function startServer() {
  await connectDatabase();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => {
    logger.info(`EscapeHer server running on port ${PORT}`);
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
  });

  const gracefulShutdown = async (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();
