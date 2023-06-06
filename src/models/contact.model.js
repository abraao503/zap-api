const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const contactSchema = mongoose.Schema(
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
    tags: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
contactSchema.plugin(toJSON);
contactSchema.plugin(paginate);

/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The user's phone number
 * @param {ObjectId} [excludeContactId] - The id of the contact to be excluded
 * @returns {Promise<boolean>}
 */
contactSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeContactId) {
  const contact = await this.findOne({
    _id: { $ne: excludeContactId },
    phone_number: phoneNumber,
  });
  return !!contact;
};

contactSchema.pre('save', async function (next) {
  const contact = this;

  if (contact.isModified('phone_number')) {
    // remove all non-digit characters
    contact.phone_number = contact.phone_number.replace(/\D/g, '');
  }

  next();
});

/**
 * @typedef Contact
 */
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
