const express = require('express');
const randomString = require('randomized-string');
// const {
//   fsReader,
// } = require('../utils/fsUtils');
const { emailValidator, passValidator } = require('../middlewares/loginField');

const route = express.Router();

// const PATH_TALKER = './src/talker.json';

route.post('/', passValidator, emailValidator, async (req, res) => {
  // const loginInfos = req.body;
  const TOKEN = randomString.generate(16);
  res.status(200).json({ token: TOKEN });
});

module.exports = route;