const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tagSchema.plugin(toJSON);
tagSchema.plugin(paginate);

/**
 * @typedef Tag
 */
const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
