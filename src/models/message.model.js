const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const messageSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    file: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'File',
    },
    is_first_message: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_last_message: {
      type: Boolean,
      required: true,
      default: false,
    },
    next_message: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Message',
    },
    delay: {
      type: Number,
      min: 0,
      max: 60,
    },
    options: [
      {
        next_message: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Message',
        },
        content: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    campaign: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
