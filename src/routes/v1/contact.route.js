const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const contactValidation = require('../../validations/contact.validation');
const contactController = require('../../controllers/contact.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(contactValidation.createContact), contactController.createContact)
  .get(contactController.getContacts);

router.route('/import').post(validate(contactValidation.createContacts), contactController.createContacts);

router.route('/delete').post(contactController.deleteContacts);

router
  .route('/:contactId')
  .patch(validate(contactValidation.updateContact), contactController.updateContact)
  .delete(validate(contactValidation.deleteContact), contactController.deleteContact);

module.exports = router;
