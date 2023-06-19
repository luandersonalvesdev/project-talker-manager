const express = require('express');
const talkerRoute = require('./routes/talkerRoute');
const loginRoute = require('./routes/loginRoute');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/talker', talkerRoute);
app.use('/login', loginRoute);

app.use((req, res) => res.status(404).json({ message: 'not found' }));

app.use((err, req, res, _next) => res.status(err.status).json({ message: err.message }));

app.listen(PORT, () => {
  console.log('Online');
});
