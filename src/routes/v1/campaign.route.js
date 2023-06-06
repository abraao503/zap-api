const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const campaignValidation = require('../../validations/campaign.validation');
const campaignController = require('../../controllers/campaign.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(campaignValidation.createCampaign), campaignController.createCampaign)
  .get(campaignController.getCampaigns);

router
  .route('/:campaignId')
  .get(campaignController.getCampaign)
  .patch(validate(campaignValidation.updateCampaign), campaignController.updateCampaign)
  .delete(validate(campaignValidation.deleteCampaign), campaignController.deleteCampaign);

router.route('/:campaignId/retry').post(campaignController.retryCampaign);

module.exports = router;
