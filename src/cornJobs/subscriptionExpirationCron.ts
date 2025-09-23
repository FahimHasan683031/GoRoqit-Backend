import cron from 'node-cron';
import { checkAndUpdateExpiredSubscriptions } from '../app/modules/subscription/utils';


// Run daily at 2:00 AM (off-peak hours)
const subscriptionCron = cron.schedule('0 2 * * *', async () => {
  console.log('Running subscription expiration check...');
  await checkAndUpdateExpiredSubscriptions();
});

export default subscriptionCron;