const Venom = require('../lib/whatsapp/client/venom');
const Whatsapp = require('../lib/whatsapp/client/venom');
// const contactService = require('./contact.service');
const messageService = require('./message.service');

const initializeClient = async (number) => {
  await Whatsapp.initializeClient(number);
};

const sendMessageToContact = async (from, message, phoneNumber) => {
  console.log('sendMessageToContact', from, message, phoneNumber);
  return Venom.sendMessage(from, phoneNumber, message);
};

const sendMessageToContactByMessageId = async (messageId, phoneNumber) => {
  const message = await messageService.getMessageById(messageId);

  if (message) {
    return this.sendMessageToContact({
      message: message.text,
      number: phoneNumber,
    });
  }

  return false;
};

const getIntanceStatus = (number) => {
  return Venom.getIntanceStatus(number);
};

const getMessagesFromChat = async (number, chatId) => {
  const messages = await Venom.getMessagesFromChat(number, chatId);
  return messages;
};

module.exports = {
  initializeClient,
  sendMessageToContact,
  sendMessageToContactByMessageId,
  getIntanceStatus,
  getMessagesFromChat,
};
