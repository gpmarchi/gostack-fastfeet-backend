import Redis from 'ioredis';
import redisConfig from '../config/redis';

class Cache {
  constructor() {
    this.redis = new Redis({
      ...redisConfig,
      keyPrefix: 'cache:',
    });
  }

  set(key, value) {
    this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  invalidateKeys(pattern) {
    const stream = this.redis.scanStream({
      match: `cache:${pattern}`,
    });
    stream.on('data', keys => {
      if (keys.length) {
        const pipeline = this.redis.pipeline();
        keys.forEach(key => {
          pipeline.del(key.split('cache:'));
        });
        pipeline.exec();
      }
    });
  }
}

export default new Cache();
