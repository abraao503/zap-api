const mongoose = require('mongoose');

const fileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// create a virtual property for the file's url
fileSchema.virtual('url').get(function () {
  const url = process.env.APP_URL || 'http://localhost:3333';

  return `${url}/files/${this.path}`;
});

fileSchema.set('toJSON', {
  virtuals: true,
});

/**
 * @typedef File
 */
const File = mongoose.model('File', fileSchema);

module.exports = File;
