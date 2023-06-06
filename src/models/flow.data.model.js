const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const flowDataSchema = mongoose.Schema(
  {
    nodes: {
      type: Array,
      required: true,
    },
    edges: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
flowDataSchema.plugin(toJSON);

/**
 * @typedef FlowData
 */
const FlowData = mongoose.model('Flow_data', flowDataSchema);

module.exports = FlowData;
