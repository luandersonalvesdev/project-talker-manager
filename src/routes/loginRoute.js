const express = require('express');
const randomString = require('randomized-string');
const { emailValidator, passValidator } = require('../middlewares/loginField');

const route = express.Router();

route.post('/', passValidator, emailValidator, async (req, res) => {
  const TOKEN = randomString.generate(16);
  res.status(200).json({ token: TOKEN });
});

module.exports = route;