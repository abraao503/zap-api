const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const campaignContactSchema = mongoose.Schema(
  {
    campaign: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    contact: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Contact',
      required: true,
    },
    chat_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'INTERRUPTED', 'COMPLETED'],
      default: 'PENDING',
    },
    last_message: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
campaignContactSchema.plugin(toJSON);

/**
 * @typedef CampaignContact
 */
const CampaignContact = mongoose.model('Campaign_contact', campaignContactSchema);

module.exports = CampaignContact;
