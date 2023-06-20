const fs = require('fs/promises');

const fsReader = async (path) => {
  const talkers = await fs.readFile(path, 'utf-8');
  const convertTalkers = JSON.parse(talkers);
  return convertTalkers;
};

const fsWrite = async (talker, path) => {
  const talkers = await fsReader(path);
  await fs.writeFile(path, JSON.stringify([...talkers, talker]));
};

module.exports = {
  fsReader,
  fsWrite,
};