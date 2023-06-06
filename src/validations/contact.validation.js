const Joi = require('joi');

const createContacts = {
  body: Joi.object().keys({
    contacts: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        phone_number: Joi.string().required(),
        tags: Joi.array().items(Joi.string()),
      })
    ),
  }),
};

const createContact = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  }),
};

const updateContact = {
  body: Joi.object().keys({
    name: Joi.string(),
    phone_number: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  }),
};

const getContacts = {
  query: Joi.object().keys({
    name: Joi.string(),
    phone_number: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createContacts,
  getContacts,
  updateContact,
  createContact,
};
