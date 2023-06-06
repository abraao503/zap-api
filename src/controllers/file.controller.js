// const { Client } = require('whatsapp-web.js');
const { resolve } = require('path');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services');

const createFile = catchAsync(async (req, res) => {
  const { file } = req.files;
  const fileExtension = file.name.split('.').pop();
  const fileName = `${file.md5}.${fileExtension}`;
  const path = resolve(__dirname, '..', '..', 'public', 'uploads', fileName);

  console.log('path', path);

  const fileData = {
    name: file.name,
    path: fileName,
    size: file.size,
    type: file.mimetype,
  };

  const fileCreated = await fileService.createFile(fileData);

  file.mv(path, (err) => {
    if (err) {
      console.log(err);
    }

    console.log('File uploaded: ', fileName);
  });

  res.status(httpStatus.CREATED).send(fileCreated);
});

module.exports = {
  createFile,
};
