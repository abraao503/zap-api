const { JobHandlers } = require('../handlers');

const campaignDefinitions = (agenda) => {
  agenda.define('initialize-campaign', JobHandlers.initializeCampaign);
};

module.exports = {
  campaignDefinitions,
};
