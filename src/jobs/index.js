const { Agenda } = require('@hokify/agenda');
const { allDefinitions } = require('./definitions');

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL,
    collection: 'agenda_jobs',
  },
});

agenda.on('ready', () => console.log('Agenda started!')).on('error', () => console.log('Agenda connection error!'));

// define all agenda jobs
allDefinitions(agenda);

// start agenda
(async () => {
  await agenda.start();
})();

module.exports = agenda;
