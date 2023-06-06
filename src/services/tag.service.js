const { Tag } = require('../models');

/**
 * Query for instances
 * @returns {Promise<Tag>}
 */
const getTags = async () => {
  return Tag.find();
};

const createTag = async (tagBody) => {
  return Tag.create(tagBody);
};

const createTags = async (tags) => {
  const createdTags = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const tag of tags) {
    const tagFound = await Tag.findOne({
      name: tag.toUpperCase(),
    });

    if (!tagFound) {
      const createdTag = await Tag.create({
        name: tag,
      });

      createdTags.push(createdTag);
    } else {
      createdTags.push(tagFound);
    }
  }

  return createdTags;
};

module.exports = {
  getTags,
  createTag,
  createTags,
};
