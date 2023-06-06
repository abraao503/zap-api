const { Campaign, Message } = require('../../models');
const MessageService = require('../message.service');

const updateCampaign = async (campaignBody, campaignId) => {
  await Message.deleteMany({ campaign: campaignId });
  await MessageService.createMessages(campaignBody.messages, campaignId);
  await Campaign.updateOne({ _id: campaignId }, campaignBody);

  return Campaign.findById(campaignId);
};

const updateCampaignById = async (campaignBody, campaignId) => {
  return Campaign.updateOne({ _id: campaignId }, campaignBody);
};

module.exports = {
  updateCampaign,
  updateCampaignById,
};
