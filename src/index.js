import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './api/routes/index.js';
import TgBot from './common/telegram/index.js';
import MatchWorker from './common/queues/match.worker.js'
import Scheduler from './common/cron/index.js'; // Import the Scheduler class

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/v1', apiRoutes);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Matcher API",
      version: "0.1.0",
    },
    servers: [
      {
        url: `/api/v1`,
      },
    ],
  },
  apis: ["src/**/*.routes.js", "src/**/*.js"],
};

const specs = swaggerJSDoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

TgBot.init();
Scheduler.scheduleMatchPublishing();

app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});