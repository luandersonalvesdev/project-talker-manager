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
};