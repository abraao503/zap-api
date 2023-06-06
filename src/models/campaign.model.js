const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const campaignSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Tag',
      },
    ],
    instance: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Instance',
      required: true,
    },
    to_schedule: {
      type: Boolean,
      required: true,
      default: false,
    },
    scheduled_at: {
      type: Date,
      required: false,
    },
    initialization_status: {
      type: String,
      required: true,
      default: 'NOT_INITIALIZED',
      enum: ['NOT_INITIALIZED', 'IN_PROGRESS', 'WAITING', 'COMPLETED', 'ERROR'],
    },
    error: {
      type: String,
      required: false,
    },
    flow_data: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Flow_data',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
campaignSchema.plugin(toJSON);

/**
 * @typedef Campaign
 */
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
