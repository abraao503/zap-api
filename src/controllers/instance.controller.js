// const { Client } = require('whatsapp-web.js');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { instanceService } = require('../services');

const createInstance = catchAsync(async (req, res) => {
  const instance = await instanceService.createInstance(req.body);
  res.status(httpStatus.CREATED).send(instance);
});

const getInstances = catchAsync(async (req, res) => {
  const instances = await instanceService.getInstances();
  res.send(instances);
});

const connectInstance = catchAsync(async (req, res) => {
  const qrCode = await instanceService.connectIntance(req.params.instanceId);
  res.send(qrCode);
});

module.exports = {
  createInstance,
  getInstances,
  connectInstance,
};
