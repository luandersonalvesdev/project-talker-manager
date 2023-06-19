const fs = require('fs/promises');

const fsReader = async (path) => {
  const talkers = await fs.readFile(path, 'utf-8');
  const convertTalkers = JSON.parse(talkers);
  return convertTalkers;
};

module.exports = {
  fsReader,
};