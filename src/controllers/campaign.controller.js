const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { campaignService } = require('../services');
const createCampaignService = require('../services/campaign/create.campaign.service');
const updateCampaignService = require('../services/campaign/update.campaign.service');
const retrycampaignService = require('../services/campaign/retry.campaign.service');

const createCampaign = catchAsync(async (req, res) => {
  const campaign = await createCampaignService.createCampaign(req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const updateCampaign = catchAsync(async (req, res) => {
  const campaign = await updateCampaignService.updateCampaign(req.body, req.params.campaignId);
  res.send(campaign);
});

const deleteCampaign = catchAsync(async (req, res) => {
  await campaignService.deleteCampaign(req.params.campaignId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCampaigns = catchAsync(async (req, res) => {
  const result = await campaignService.getCampaigns();
  res.send(result);
});

const getCampaign = catchAsync(async (req, res) => {
  const campaign = await campaignService.getCampaign(req.params.campaignId);
  res.send(campaign);
});

const retryCampaign = catchAsync(async (req, res) => {
  const campaign = await retrycampaignService.retrycampaign(req.params.campaignId);
  res.send(campaign);
});

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaigns,
  retryCampaign,
  getCampaign,
};
