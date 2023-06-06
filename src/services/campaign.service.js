const { Campaign } = require('../models');

const deleteCampaign = async (campaignId) => {
  return Campaign.findByIdAndDelete(campaignId);
};

const getCampaign = async (campaignId) => {
  return Campaign.findById(campaignId).populate('flow_data').populate('tags');
};

const getCampaigns = async () => {
  return Campaign.find().populate('tags').sort({ createdAt: -1 });
};

module.exports = {
  deleteCampaign,
  getCampaign,
  getCampaigns,
};
