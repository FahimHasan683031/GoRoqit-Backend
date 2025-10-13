// src/cornJobs/subscriptionExpirationCron.ts
import cron from 'node-cron';
import { checkAndUpdateExpiredSubscriptions } from '../app/modules/subscription/utils';

const subscriptionCron = cron.schedule('*/2 * * * *', async () => {
  console.log('⏰ Running subscription expiration check...');
  console.log('Running at:', new Date().toISOString());
  await checkAndUpdateExpiredSubscriptions();
});

// Start the job
subscriptionCron.start();

console.log('✅ Subscription expiration cron initialized');

export default subscriptionCron;
