const venom = require('venom-bot');
const socketIo = require('socket.io');
const { resolve } = require('path');
const http = require('http');
const { getNextMessage, getMessageById } = require('../../../services/message.service');
const { updateCampaignContact } = require('../../../services/campaign.contact.service');
const formatNumber = require('../../../utils/formatNumber');
const sleep = require('../../../utils/Sleep');
const app = require('../../../app');

const server = http.createServer(app);
server.listen(3334);

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
});

async function waitForMessage(seconds, from, client) {
  await client.sendSeen(from);
  await client.startTyping(from);
  await sleep(seconds * 1000);
  await client.stopTyping(from);
}

class Whatsapp {
  constructor() {
    this.instances = {};
  }

  async initializeClient(number) {
    const from = formatNumber(number);

    const client = await venom.create(
      from,
      (base64Qrimg) => {
        // send qr code image to client using socket.io
        console.log('QR RECEIVED', base64Qrimg);
        io.emit('qr-code', base64Qrimg);
      },
      (statusSession) => {
        console.log('Status Session: ', statusSession);

        io.emit('status-session', {
          statusSession,
          from,
        });

        if (this.instances[from]) {
          this.instances[from].status = statusSession;
        } else {
          this.instances[from] = {
            status: statusSession,
          };
        }
      },
      {
        multidevice: true,
      }
    );

    if (this.instances[from]) {
      this.instances[from].client = client;
    } else {
      this.instances[from] = {
        client,
        status: '',
      };
    }

    console.log(`Client ${from} is ready!`);

    client.onMessage(async (message) => {
      try {
        if (message.from === 'status@broadcast' || message.isGroupMsg || message.fromMe) {
          return;
        }

        console.log('MESSAGE', message.body);

        const currentMessage = await getNextMessage(message.from, message.body);

        console.log('currentMessage - v', currentMessage);

        if (currentMessage) {
          if (currentMessage.delay) {
            await waitForMessage(currentMessage.delay, message.from, client);
          }

          let isLastMessage = currentMessage.is_last_message;

          if (currentMessage.type === 'TEXT') {
            await this.sendMessage(client.session, message.from, currentMessage);
          } else if (currentMessage.type === 'IMAGE') {
            await this.sendImage(client.session, message.from, currentMessage.file.path);
          } else if (currentMessage.type === 'AUDIO') {
            await this.sendAudio(client.session, message.from, currentMessage.file.path);
          }

          let nextMessageId = currentMessage.next_message;

          while (nextMessageId) {
            const nextMessage = await getMessageById(nextMessageId);

            if (nextMessage.delay) {
              await waitForMessage(nextMessage.delay, message.from, client);
            }

            if (nextMessage.type === 'TEXT') {
              await this.sendMessage(client.session, message.from, nextMessage);
            } else if (nextMessage.type === 'IMAGE') {
              await this.sendImage(client.session, message.from, nextMessage.file.path);
            } else if (nextMessage.type === 'AUDIO') {
              await this.sendAudio(client.session, message.from, nextMessage.file.path);
            }

            nextMessageId = nextMessage.next_message;
            isLastMessage = nextMessage.is_last_message;
          }

          await updateCampaignContact(currentMessage.campaignContactId, {
            last_message: nextMessageId || currentMessage._id,
            ...(isLastMessage && { status: 'COMPLETED' }),
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    });

    client.onStateChange((state) => {
      console.log('State changed: ', state);
      // force whatsapp take over
      if ('CONFLICT'.includes(state)) client.useHere();
      // detect disconnect on whatsapp
      if ('UNPAIRED'.includes(state)) console.log('logout');
    });

    return client;
  }

  async sendImage(from, to, imageName) {
    try {
      const client = this.instances[from]?.client;

      if (!client) {
        throw new Error('Client not initialized!');
      }

      const imagePath = resolve(__dirname, '..', '..', '..', '..', 'public', 'uploads', imageName);
      console.log('imagePath', imagePath);

      const result = await client.sendImage(to, imagePath, imageName);

      return [result, null];
    } catch (error) {
      if (error.text) {
        const newError = new Error(error.text);
        return [null, newError];
      }

      return [null, error];
    }
  }

  async sendAudio(from, to, audioName) {
    try {
      const client = this.instances[from]?.client;

      if (!client) {
        throw new Error('Client not initialized!');
      }

      const audioPath = resolve(__dirname, '..', '..', '..', '..', 'public', 'uploads', audioName);
      console.log('audioPath', audioPath);

      const result = await client.sendVoice(to, audioPath);

      return [result, null];
    } catch (error) {
      if (error.text) {
        const newError = new Error(error.text);
        return [null, newError];
      }

      return [null, error];
    }
  }

  async sendText(from, to, text) {
    const client = this.instances[from]?.client;

    if (!client) {
      throw new Error('Client not initialized!');
    }

    return client.sendText(to, text);
  }

  async sendMessage(from, to, message) {
    const formattedNumber = formatNumber(to);

    console.log('formattedNumber', formattedNumber);

    if (message.type === 'IMAGE') {
      console.log('image', message.file.path);
      return this.sendImage(from, formattedNumber, message.file.path);
    }

    if (message.type === 'AUDIO') {
      return this.sendAudio(from, formattedNumber, message.file.path);
    }

    // if (message?.options?.length > 0) {
    //   const messageBody = {
    //     title: message.text,
    //     description: '.',
    //   };
    //   return this.sendMessageWithButtons(from, formattedNumber, messageBody, message.options);
    // }

    return this.sendTextMessage(from, formattedNumber, message.text);
  }

  async sendTextMessage(from, to, message) {
    try {
      console.log('Sending message to: ', to);
      const result = await this.sendText(from, to, message);
      return [result, null];
    } catch (error) {
      if (error.text) {
        const newError = new Error(error.text);
        return [null, newError];
      }
      return [null, error];
    }
  }

  // async sendMessageWithButtons(from, to, message, options) {
  //   try {
  //     const { title, description } = message;

  //     // const buttons = options.map((option, index) => ({
  //     //   id: `${index + 1}`,
  //     //   text: option.content,
  //     // }));
  //     const buttons = [
  //       {
  //         buttonId: '1',
  //         buttonText: {
  //           displayText: 'Button 1',
  //         },
  //       },
  //       {
  //         buttonId: '2',
  //         buttonText: {
  //           displayText: 'Button 2',
  //         },
  //       },
  //     ];

  //     const client = this.instances[from]?.client;

  //     if (!client) {
  //       throw new Error('Client not initialized!');
  //     }

  //     const result = await client.sendButtons(to, title, buttons, description);

  //     return [result, null];
  //   } catch (error) {
  //     console.log('error', error);
  //     if (error.text) {
  //       const newError = new Error(error.text);
  //       return [null, newError];
  //     }
  //     return [null, error];
  //   }
  // }

  getIntanceStatus(number) {
    const from = formatNumber(number);
    const client = this.instances[from]?.client;

    if (!client) {
      return 'Not initialized';
    }

    return this.instances[from].status;
  }

  async getMessagesFromChat(number, chatId) {
    const from = formatNumber(number);
    const client = this.instances[from]?.client;

    if (!client) {
      return 'Not initialized';
    }

    await client.getAllMessagesInChat(chatId);
    const messages = await client.loadEarlierMessages(chatId);

    return messages;
  }
}

module.exports = new Whatsapp();
