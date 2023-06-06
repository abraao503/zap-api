const catchAsync = require('../utils/catchAsync');
const { tagService } = require('../services');

const getTags = catchAsync(async (req, res) => {
  const tags = await tagService.getTags();
  res.send(tags);
});

const createTag = catchAsync(async (req, res) => {
  const tag = await tagService.createTag(req.body);
  res.send(tag);
});

module.exports = {
  getTags,
  createTag,
};
