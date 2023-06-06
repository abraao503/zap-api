const fs = require('fs');

const getSessionPath = (number) => {
  return `./sessions/${number}.json`;
};

const saveSession = (session, number) => {
  // eslint-disable-next-line
  fs.writeFileSync(getSessionPath(number), JSON.stringify(session));
};

const deleteSessionPath = (number) => {
  const sessionPath = getSessionPath(number);

  // eslint-disable-next-line
  if (fs.existsSync(sessionPath)) {
    // eslint-disable-next-line
    fs.unlinkSync(sessionPath);
  }
};

module.exports = {
  getSessionPath,
  saveSession,
  deleteSessionPath,
};
