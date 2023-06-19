const express = require('express');
const {
  fsReader,
} = require('../utils/fsUtils');

const route = express.Router();

route.get('/', async (req, res) => {
  const talkers = await fsReader('./src/talker.json');
  res.status(200).json(JSON.parse(talkers));
});

module.exports = route;