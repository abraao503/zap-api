const agenda = require('./index');

const schedule = {
  initializeCampaign: async (data, date) => {
    await agenda.schedule(date, 'initialize-campaign', data);
  },
};

module.exports = { schedule };
