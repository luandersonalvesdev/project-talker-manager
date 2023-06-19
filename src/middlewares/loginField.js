const emailValidator = ({ body: { email } }, res, next) => {
  const rEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
  if (!email) return next({ status: 400, message: 'O campo "email" é obrigatório' });
  if (!rEmail.test(email)) {
    return next({ status: 400, message: 'O "email" deve ter o formato "email@email.com"' }); 
  }
  return next();
};

const passValidator = ({ body: { password } }, res, next) => {
  if (!password) return next({ status: 400, message: 'O campo "password" é obrigatório' });
  if (password.length < 6) {
    return next({ status: 400, message: 'O "password" deve ter pelo menos 6 caracteres' }); 
  }
  next();
};

module.exports = { emailValidator, passValidator };