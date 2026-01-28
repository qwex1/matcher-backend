// src/queues/worker.js
import { Worker } from 'bullmq';
import { redisClient } from './redis.js';
import MatchesService from '../../api/matches/matches.service.js';

class MatchWorker {
  constructor() {
    console.log('MatchWorker initialized'); // Debugging inf
    this.worker = new Worker(
      'matchQueue',
      async job => {
        try {
          const { introUuid } = job.data;
          const result = await MatchesService.CreateMatches(introUuid);
          return { success: true, ...result };
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          throw error;
        }
      },
      { 
        connection: redisClient,
        concurrency: 5,
        limiter: {
          max: 10,
          duration: 1000
        }
      }
    );

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed for user ${job.data.introUuid }`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed for user ${job.data.introUuid }:`, err);
    });

    this.worker.on('error', (err) => {
      console.error('Worker error:', err);
    });
  }

  async close() {
    await this.worker.close();
  }
}

export default new MatchWorker();