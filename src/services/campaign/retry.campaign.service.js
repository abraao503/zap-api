const { Campaign } = require('../../models');
const { schedule } = require('../../jobs/schedule');

const retrycampaign = async (campaignId) => {
  const campaign = await Campaign.findById(campaignId);

  if (campaign.initialization_status !== 'ERROR') {
    throw new Error('Campaign is not in error state');
  }

  const scheduleDate = campaign.to_schedule ? campaign.scheduled_at : new Date();

  await schedule.initializeCampaign({ campaignId: campaign._id }, scheduleDate);

  return campaign;
};

module.exports = {
  retrycampaign,
};
