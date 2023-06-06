const Joi = require('joi');
const { objectId } = require('./custom.validation');

const messageSchema = Joi.object({
  type: Joi.string().valid('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT').required(),
  text: Joi.string(),
  description: Joi.string(),
  file: Joi.string().custom(objectId),
  next_message: Joi.link('#messageSchema').allow(null),
  delay: Joi.number().integer().min(0).max(60),
  options: Joi.array().items(
    Joi.object().keys({
      content: Joi.string().required(),
      next_message: Joi.link('#messageSchema'),
    })
  ),
  position: Joi.object().keys({
    x: Joi.number().required(),
    y: Joi.number().required(),
  }),
}).id('messageSchema');

const createCampaign = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    tags: Joi.array().items(Joi.string().required()).required(),
    to_schedule: Joi.boolean().required(),
    scheduled_at: Joi.date().when('to_schedule', {
      is: true,
      then: Joi.required(),
    }),
    message: messageSchema,
    instance: Joi.string().custom(objectId),
    flow: Joi.object()
      .keys({
        nodes: Joi.array().required(),
        edges: Joi.array().required(),
      })
      .required(),
  }),
};

const updateCampaign = {
  params: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    tags: Joi.array().items(Joi.string().required()).required(),
    to_schedule: Joi.boolean().required(),
    scheduled_at: Joi.date().when('to_schedule', {
      is: true,
      then: Joi.required(),
    }),
    message: messageSchema,
  }),
};

const deleteCampaign = {
  params: Joi.object().keys({
    campaignId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
