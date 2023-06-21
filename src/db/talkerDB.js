const connection = require('./connection');

const allTalkers = async () => {
  const [response] = await connection.execute(`
    SELECT * FROM talkers
  `);
  return response;
};

module.exports = allTalkers;