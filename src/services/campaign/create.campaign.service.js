const { Campaign } = require('../../models');
const { schedule } = require('../../jobs/schedule');
const MessageService = require('../message.service');
const FlowDataService = require('../flow.data.service');

const createCampaign = async (campaignBody) => {
  const { message, flow } = campaignBody;

  const flowData = await FlowDataService.createFlowData({
    nodes: flow.nodes,
    edges: flow.edges,
  });

  const campaign = await Campaign.create({
    ...campaignBody,
    status: campaignBody.to_schedule ? 'WAITING' : 'NOT_INITIALIZED',
    flow_data: flowData._id,
  });

  await MessageService.createMessageRecursively(
    {
      ...message,
      is_first_message: true,
    },
    campaign._id
  );

  let scheduleDate = null;

  if (campaignBody.to_schedule) {
    scheduleDate = new Date(campaignBody.scheduled_at);
  } else {
    scheduleDate = new Date();
  }

  console.log('Scheduling campaign initialization', scheduleDate);

  await schedule.initializeCampaign({ campaignId: campaign._id }, scheduleDate);

  return campaign;
};

module.exports = {
  createCampaign,
};
