import Bee from 'bee-queue';

import redisConfig from '../config/redis';
import NewParcelMail from '../app/jobs/NewParcelMail';

const jobs = [NewParcelMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        beeQueue: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queueKey, jobData) {
    return this.queues[queueKey].beeQueue.createJob(jobData).save();
  }

  processQueues() {
    jobs.forEach(job => {
      const { beeQueue, handle } = this.queues[job.key];

      beeQueue.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, error) {
    console.log(`Queue ${job.queue.name}: FAILED`, error);
  }
}

export default new Queue();
