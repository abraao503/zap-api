const httpStatus = require('http-status');
const { Contact, Tag } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get contact by id
 * @param {ObjectId} id
 * @returns {Promise<Contacts>}
 */
const getContactById = async (id) => {
  return Contact.findById(id);
};

/**
 * Create a contact
 * @param {Object} contactBody
 * @returns {Promise<Contacts>}
 */
const createContact = async (contactBody, ignoreExistingNumbers = false) => {
  const sanatizedPhoneNumber = contactBody.phone_number.replace(/[^0-9]/g, '');

  const isPhoneNumberTaken = await Contact.isPhoneNumberTaken(sanatizedPhoneNumber);

  if (ignoreExistingNumbers && isPhoneNumberTaken) {
    return;
  }

  if (isPhoneNumberTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
  }

  return Contact.create({
    ...contactBody,
    phone_number: sanatizedPhoneNumber,
  });
};

/**
 * Update contact by id
 * @param {ObjectId} contactId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateContactById = async (contactId, updateBody) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }

  const isPhoneNumberTaken = await Contact.isPhoneNumberTaken(updateBody.phone_number, contactId);

  if (updateBody.phone_number && isPhoneNumberTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
  }

  Object.assign(contact, updateBody);
  await contact.save();
  return contact;
};

/**
 * Create multiple contacts
 * @param {Array} contacts
 * @returns {Promise<Contacts>}
 */

const createContacts = async (contactsBody) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const contact of contactsBody.contacts) {
    const isPhoneNumberTaken = await Contact.isPhoneNumberTaken(contact.phone_number);
    const { tags: tagNames } = contact;
    const tags = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const tagName of tagNames) {
      const tag = await Tag.findOneAndUpdate(
        {
          name: tagName,
        },
        {
          name: tagName,
        },
        { upsert: true, useFindAndModify: false, new: true }
      );

      tags.push(tag._id);
    }

    if (!isPhoneNumberTaken) {
      const ignoreExistingNumbers = true;
      await createContact(
        {
          ...contact,
          tags,
        },
        ignoreExistingNumbers
      );
    } else {
      await Contact.findOneAndUpdate(
        {
          phone_number: contact.phone_number,
        },
        {
          ...contact,
          tags,
        },
        { upsert: true }
      );
    }
  }
};

/**
 * Delete contact by id
 * @param {ObjectId} contactId
 * @returns {Promise<Contacts>}
 */
const deleteContactById = async (contactId) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  await contact.remove();
  return contact;
};

/**
 * Query for contacts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryContacts = async (filter, options) => {
  const contacts = await Contact.paginate(filter, {
    ...options,
    populate: 'tags',
  });

  return contacts;
};

const getContactByPhoneNumber = async (phoneNumber) => {
  const contact = await Contact.findOne({ phone_number: phoneNumber });
  return contact;
};

const deleteContacts = async (contactIds) => {
  const contacts = await Contact.deleteMany({ _id: { $in: contactIds } });
  return contacts;
};

module.exports = {
  createContacts,
  createContact,
  getContactById,
  deleteContactById,
  updateContactById,
  queryContacts,
  getContactByPhoneNumber,
  deleteContacts,
};
