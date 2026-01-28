import { Queue } from 'bullmq';
import { redisClient } from './redis.js';

class MatchQueue {
  constructor() {
    this.queue = new Queue('matchQueue', {
      connection: redisClient,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000
        }
      }
    });
  }

  async addJob(introUuid, priority = 'normal') {
    console.log(`Adding job for introUuid: ${introUuid} with priority: ${priority}`); // Debugging informati
    return this.queue.add(
      'calculateMatch',
      { introUuid },
      { 
        priority: this.getPriorityValue(priority),
        jobId: `intro:${introUuid}`
      }
    );
  }

  getPriorityValue(priority) {
    const priorities = {
      high: 1,
      normal: 2,
      low: 3
    };
    return priorities[priority] || 2;
  }

  async getJobCounts() {
    return this.queue.getJobCounts();
  }

  async cleanOldJobs() {
    await this.queue.clean(1000, 1000 * 60 * 60 * 24, 'completed');
    await this.queue.clean(1000, 1000 * 60 * 60 * 24, 'failed');
  }
}

export default new MatchQueue();