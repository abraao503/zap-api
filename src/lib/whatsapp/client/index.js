const { Client, Buttons, LocalAuth } = require('whatsapp-web.js');
const socketIo = require('socket.io');
const http = require('http');
const app = require('../../../app');

const server = http.createServer(app);
server.listen(3335);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
});

// async function waitForMessage(seconds, from, client) {
//   await client.sendSeen(from);
//   await client.startTyping(from);
//   await sleep(seconds * 1000);
//   await client.stopTyping(from);
// }

class Whatsapp {
  constructor() {
    this.instances = {};
  }

  async initializeClient(number) {
    const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: false },
    });

    client.initialize();

    client.on('qr', (qr) => {
      console.log('QR RECEIVED', qr);
      io.emit('qr-code', qr);
    });

    client.on('ready', () => {
      io.emit('status-session', {
        statusSession: 'ready',
        from: number,
      });
    });

    this.instances[number] = {
      client,
      status: '',
    };

    client.on('message', async (msg) => {
      console.log('MESSAGE RECEIVED', msg);

      if (msg.body === '!button') {
        console.log('BUTTON');
        const button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');
        client.sendMessage(msg.from, button);
      }
    });
  }
}

module.exports = new Whatsapp();
