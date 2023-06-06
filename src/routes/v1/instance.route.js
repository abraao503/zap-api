const express = require('express');
// const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
const instanceController = require('../../controllers/instance.controller');

const router = express.Router();

router.route('/').post(instanceController.createInstance).get(instanceController.getInstances);
router.route('/connect/:instanceId').post(instanceController.connectInstance);

module.exports = router;
