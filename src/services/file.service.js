const { File } = require('../models');

/**
 * Query for instances
 * @returns {Promise<File>}
 */
const getFiles = async () => {
  return File.find();
};

const createFile = async (file) => {
  return File.create(file);
};

module.exports = {
  getFiles,
  createFile,
};
