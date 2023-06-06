const { Instance } = require('../models');
const WhatsAppService = require('./whatsapp.service');

/**
 * Create a instance
 * @param {Object} instanceBody
 * @returns {Promise<Instance>}
 */
const createInstance = async (instanceBody) => {
  return Instance.create(instanceBody);
};

/**
 * Query for instances
 * @returns {Promise<Instance>}
 */
const getInstances = async () => {
  const instances = await Instance.find();

  const instancesWithStatus = instances.map((instance) => {
    const status = WhatsAppService.getIntanceStatus(instance.phone_number);
    console.log(status);
    return { ...instance.toJSON(), status };
  });

  return instancesWithStatus;
};

const connectIntance = async (instanceId) => {
  const instance = await Instance.findById(instanceId);

  if (!instance) {
    throw new Error('Instance not found');
  }

  await WhatsAppService.initializeClient(instance.phone_number);
};

module.exports = {
  createInstance,
  getInstances,
  connectIntance,
};
