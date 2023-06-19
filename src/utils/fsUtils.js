const fs = require('fs/promises');

const fsReader = (path) => fs.readFile(path, 'utf-8');

module.exports = {
  fsReader,
};