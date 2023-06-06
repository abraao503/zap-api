const { campaignDefinitions } = require('./campaign.definition');

const definitions = [campaignDefinitions];

const allDefinitions = (agenda) => {
  definitions.forEach((definition) => {
    definition(agenda);
  });
};

module.exports = { allDefinitions };
