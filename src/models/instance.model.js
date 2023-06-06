const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const instanceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
instanceSchema.plugin(toJSON);

/**
 * @typedef Instance
 */
const Instance = mongoose.model('Instance', instanceSchema);

module.exports = Instance;
