const { Message } = require('../models');
const campaignContactService = require('./campaign.contact.service');

const createMessageRecursively = async (message, campaignId) => {
  const { options } = message;

  if (options && options.length > 0) {
    const newOptions = await Promise.all(
      options.map(async (option) => {
        const { next_message: nextMessage } = option;
        let newNextMessage = null;

        if (nextMessage) {
          newNextMessage = await createMessageRecursively(nextMessage, campaignId);
        }

        return { ...option, next_message: newNextMessage ? newNextMessage._id : null };
      })
    );

    const newMessage = await Message.create({
      ...message,
      campaign: campaignId,
      options: newOptions,
      is_last_message: false,
    });

    return newMessage;
  }

  let nextMessage = null;

  if (message.next_message) {
    nextMessage = await createMessageRecursively(message.next_message, campaignId);
  }

  const newMessage = await Message.create({
    ...message,
    campaign: campaignId,
    next_message: nextMessage ? nextMessage._id : null,
    is_last_message: !nextMessage,
  });

  return newMessage;
};

const getFirstMessage = async (campaignId) => {
  const firstMessage = await Message.findOne({ campaign: campaignId, is_first_message: true }).populate('file');
  return firstMessage;
};

const getMessageById = async (messageId) => {
  const message = await Message.findById(messageId).populate('file');
  return message;
};

const getNextMessage = async (phoneNumber, message) => {
  const campaignContact = await campaignContactService.findByPhoneNumber(phoneNumber);

  if (campaignContact?.last_message) {
    const { options } = campaignContact.last_message;

    console.log('options', options);

    const optionMatch = options.find((option) => option.content === message);

    if (optionMatch) {
      const nextMessage = await Message.findById(optionMatch.next_message).populate('file');

      if (!nextMessage) {
        return null;
      }

      return {
        _id: nextMessage._id,
        text: nextMessage.text,
        type: nextMessage.type,
        options: nextMessage.options,
        campaignContactId: campaignContact._id,
        next_message: nextMessage.next_message,
      };
    }
  }

  return null;
};

module.exports = {
  getFirstMessage,
  getMessageById,
  getNextMessage,
  createMessageRecursively,
};
