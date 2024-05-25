const cron = require('node-cron');
const PropertyRequest = require('../models/propertyRequest');

const refreshPropertyRequests = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    await PropertyRequest.updateMany(
      { refreshedAt: { $lt: threeDaysAgo } },
      { $set: { refreshedAt: new Date() } }
    );
    console.log('Property requests refreshed successfully');
  } catch (error) {
    console.error('Error refreshing property requests:', error);
  }
};

// Schedule the cron job to run every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running the cron job to refresh property requests');
  refreshPropertyRequests();
});

module.exports = { refreshPropertyRequests };
