const express = require('express');
const {
  fsReader,
} = require('../utils/fsUtils');

const route = express.Router();

const PATH_TALKER = './src/talker.json';

route.get('/', async (req, res) => {
  const talkers = await fsReader(PATH_TALKER);
  res.status(200).json(talkers);
});

route.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fsReader(PATH_TALKER);
  const talker = talkers.find((talk) => talk.id === Number(id));
  if (talker) return res.status(200).json(talker);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

module.exports = route;