const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { contactService, tagService } = require('../services');
const pick = require('../utils/pick');
const isObjectId = require('../utils/isObjectId');

const createContact = catchAsync(async (req, res) => {
  const tagsIds = req.body.tags.filter((tag) => isObjectId(tag));
  const tagsNames = req.body.tags.filter((tag) => !isObjectId(tag));

  const tags = await tagService.createTags(tagsNames);

  req.body.tags = [...tagsIds, ...tags.map((tag) => tag.id)];
  const contact = await contactService.createContact(req.body);
  res.status(httpStatus.CREATED).send(contact);
});

const createContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.createContacts(req.body);
  res.status(httpStatus.CREATED).send(contacts);
});

const getContacts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'phone_number']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  if (req.query.tags) {
    filter.tags = {
      $in: req.query.tags,
    };
  }

  if (req.query.name) {
    filter.name = {
      $regex: req.query.name,
      $options: 'i',
    };
  }

  if (req.query.phone_number) {
    filter.phone_number = {
      $regex: req.query.phone_number,
      $options: 'i',
    };
  }

  const result = await contactService.queryContacts(filter, options);

  res.send(result);
});

const updateContact = catchAsync(async (req, res) => {
  const contact = await contactService.updateContactById(req.params.contactId, req.body);
  res.send(contact);
});

const deleteContact = catchAsync(async (req, res) => {
  await contactService.deleteContactById(req.params.contactId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteContacts = catchAsync(async (req, res) => {
  await contactService.deleteContacts(req.body.contactIds);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createContact,
  getContacts,
  createContacts,
  updateContact,
  deleteContact,
  deleteContacts,
};
