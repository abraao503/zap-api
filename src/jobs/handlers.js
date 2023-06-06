const { initializeCampaign } = require('../services/campaign/initialize.campaign.service');

const JobHandlers = {
  initializeCampaign: async (job, done) => {
    const { data } = job.attrs;
    await initializeCampaign(data);
    done();
  },
};

module.exports = { JobHandlers };
