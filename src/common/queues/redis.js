import Redis from 'ioredis';

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || 'default',
  maxRetriesPerRequest: null,
  enableReadyCheck: false
};

const redisClient = new Redis(redisOptions);
const redisSubscriber = new Redis(redisOptions);

export { redisClient, redisSubscriber };