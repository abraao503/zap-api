const { FlowData } = require('../models');

const getFlowDatas = async () => {
  return FlowData.find();
};

const createFlowData = async (flowDataBody) => {
  return FlowData.create(flowDataBody);
};

module.exports = {
  getFlowDatas,
  createFlowData,
};
