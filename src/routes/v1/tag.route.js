const express = require('express');
const tagController = require('../../controllers/tag.controller');
const validate = require('../../middlewares/validate');
const tagValidation = require('../../validations/tag.validation');

const router = express.Router();

router.route('/').get(tagController.getTags);
router.route('/').post(validate(tagValidation.createTag), tagController.createTag);

module.exports = router;
