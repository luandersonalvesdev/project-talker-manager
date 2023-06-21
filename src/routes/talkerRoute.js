const express = require('express');
const { fsReader, fsWrite } = require('../utils/fsUtils');
const {
  tokenValidator, mandatoryValidator, nameValidator, searchTalkerQ, searchTalkerDate,
  ageValidator, watchedAtValidator, rateValidator, verifyTalkerId, searchTalkerRate,
  ratePatchValidator, rateVerify,
} = require('../middlewares/talkerValidation');
const allTalkers = require('../db/talkerDB');

const route = express.Router();

const PATH_TALKER = './src/talker.json';

route.get('/', async (req, res) => {
  const talkers = await fsReader(PATH_TALKER);
  res.status(200).json(talkers);
});

route.get('/db/', async (req, res) => {
  const talkers = await allTalkers();
  const talkersFormated = talkers.map((tal) => {
    const formated = {
      ...tal,
      talk: { watchedAt: tal.talk_watched_at, rate: tal.talk_rate },
    };
    delete formated.talk_watched_at;
    delete formated.talk_rate;
    return formated;
  });
  res.status(200).json(talkersFormated);
});

route.post('/',
  tokenValidator, mandatoryValidator, nameValidator, ageValidator,
  watchedAtValidator, rateValidator,
  async (req, res) => {
    const talkers = await fsReader(PATH_TALKER);
    const lastId = talkers.sort((idA, idB) => idB.id - idA.id)[0];
    const newTalker = { ...req.body, id: lastId.id + 1 };
    await fsWrite([...talkers, newTalker], PATH_TALKER);
    return res.status(201).json(newTalker);
});

route.get('/search/',
  tokenValidator, searchTalkerQ,
  searchTalkerRate, searchTalkerDate, async (req, res) => {
  res.status(200).json(req.talkers);
});

route.patch('/rate/:id',
  tokenValidator, rateVerify, ratePatchValidator,
  async (req, res) => {
    await fsWrite(req.talkers, PATH_TALKER);
    return res.status(204).json(req.talkers);
});

route.get('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fsReader(PATH_TALKER);
  const talker = talkers.find((talk) => talk.id === Number(id));
  if (talker) return res.status(200).json(talker);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

route.put('/:id',
  tokenValidator, mandatoryValidator, nameValidator, ageValidator,
  watchedAtValidator, rateValidator, verifyTalkerId,
  async (req, res) => {
    const { updatedTalkers } = req;
    const { id: idParams } = req.params;
    const updatedTalker = { ...req.body, id: Number(idParams) };
    await fsWrite([...updatedTalkers, updatedTalker], PATH_TALKER);
    return res.status(200).json(updatedTalker);
});

route.delete('/:id', tokenValidator, verifyTalkerId, async (req, res) => {
    const { updatedTalkers } = req;
    await fsWrite([...updatedTalkers], PATH_TALKER);
    return res.status(204).json({});
});

module.exports = route;