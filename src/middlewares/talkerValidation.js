const { fsReader } = require('../utils/fsUtils');

const PATH_TALKER = './src/talker.json';

const tokenValidator = ({ headers: { authorization } }, res, next) => {
  if (!authorization) return next({ status: 401, message: 'Token não encontrado' });
  if (authorization.length !== 16) return next({ status: 401, message: 'Token inválido' });
  next();
};

const nameValidator = ({ body: { name } }, res, next) => {
  if (name.length < 3) {
    return next({
      status: 400, message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  next();
};

const ageValidator = ({ body: { age } }, res, next) => {
  if (age <= 18 || !Number.isInteger(age)) {
    return next({
      status: 400, message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
    });
  }
  next();
};

const watchedAtValidator = ({ body: { talk: { watchedAt } } }, res, next) => {
  if (watchedAt.length !== 10 || !watchedAt.includes('/')) {
    return next({
      status: 400, message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

const rateValidator = ({ body: { talk: { rate } } }, res, next) => {
  const numRate = Number(rate);
  if (numRate < 1 || !Number.isInteger(numRate) || numRate > 5) {
    return next({
      status: 400, message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const rateVerify = (req, res, next) => {
  const { rate } = req.body;
  if (!Object.prototype.hasOwnProperty.call(req.body, 'rate')) {
    return next({
      status: 400, message: 'O campo "rate" é obrigatório',
    });
  }
  if (rate < 1 || !Number.isInteger(rate) || rate > 5) {
    return next({
      status: 400, message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
    });
  }
  next();
};

const ratePatchValidator = async (req, res, next) => {
  const { rate } = req.body;
  const id = Number(req.params.id);
  const talkers = await fsReader(PATH_TALKER);
  const updatedTalkers = talkers.map((tal) => {
    if (tal.id === id) {
      return { ...tal, talk: { ...tal.talk, rate } };
    }
    return tal;
  });
  req.talkers = updatedTalkers;
  next();
};

const verifyTalkerId = async (req, res, next) => {
  const { id: idParams } = req.params;
  const talkers = await fsReader(PATH_TALKER);
  const updatedTalkers = talkers.filter(({ id }) => id !== Number(idParams));
  if (talkers.length === updatedTalkers.length) {
    return next({ status: 404, message: 'Pessoa palestrante não encontrada' });
  }
  req.updatedTalkers = updatedTalkers;
  next();
};

const searchTalkerQ = async (req, res, next) => {
  const { q } = req.query;
  const talkers = await fsReader(PATH_TALKER);
  if (!q) {
    req.talkers = talkers;
  } else {
    req.talkers = talkers.filter((tal) => tal.name.includes(q));
  }
  next();
};

const searchTalkerRate = async (req, res, next) => {
  const { rate } = req.query;
  if (rate) {
    const numRate = Number(rate);
    if (numRate < 1 || !Number.isInteger(numRate) || numRate > 5) {
      return next({
        status: 400, message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
      });
    }
    req.talkers = req.talkers.filter(({ talk }) => talk.rate === Number(rate));
  }
  next();
};

const searchTalkerDate = async (req, res, next) => {
  const { date } = req.query;
  if (date) {
    if (date.length !== 10 || !date.includes('/')) {
      return next({
        status: 400, message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
      });
    }
    req.talkers = req.talkers.filter(({ talk }) => talk.watchedAt === date);
  }
  next();
};

const mandatoryValidator = (req, res, next) => {
  const mandatories = ['name', 'age', 'talk', 'watchedAt', 'rate'];
  const talker = Object.keys(req.body);
  if (talker.includes('talk')) talker.push(...Object.keys(req.body.talk));
  const [missing] = mandatories.filter((man) => !talker.includes(man));
  if (missing) return next({ status: 400, message: `O campo "${missing}" é obrigatório` });
  next();
};

module.exports = {
  tokenValidator,
  mandatoryValidator,
  nameValidator,
  ageValidator,
  watchedAtValidator,
  rateValidator,
  verifyTalkerId,
  searchTalkerQ,
  searchTalkerRate,
  searchTalkerDate,
  ratePatchValidator,
  rateVerify,
};