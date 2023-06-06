const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
const fileController = require('../../controllers/file.controller');

const router = express.Router();

router.route('/').post(fileController.createFile);

module.exports = router;
