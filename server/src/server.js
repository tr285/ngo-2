const app = require('./app');
const connectDB = require('./config/database');
const env = require('./config/env');

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(
      `Server running in ${env.nodeEnv} mode on port ${env.port}`
    );
  });
};

startServer();

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error.message);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});
