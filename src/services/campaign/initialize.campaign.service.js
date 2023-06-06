const { Campaign, Contact, CampaignContact } = require('../../models');
const MessageService = require('../message.service');
const WhatsappService = require('../whatsapp.service');
const Sleep = require('../../utils/Sleep');
const formatNumber = require('../../utils/formatNumber');

const initializeCampaign = async (data) => {
  const { campaignId } = data;

  const campaign = await Campaign.findOne({ _id: campaignId }).populate('instance');

  console.log('campaign', campaign);

  await Campaign.updateOne({ _id: campaign._id }, { initialization_status: 'IN_PROGRESS' });

  const firstMessage = await MessageService.getFirstMessage(campaignId);

  console.log('firstMessage', firstMessage);

  let totalSent = 0;
  let errorMessage = null;

  if (campaign && firstMessage) {
    const { tags } = campaign;
    const instancePhoneNumber = formatNumber(campaign.instance.phone_number);

    const contacts = await Contact.find({ tags: { $in: tags } });

    console.log('contacts', contacts);

    // eslint-disable-next-line no-restricted-syntax
    for (const contact of contacts) {
      const { phone_number: phoneNumber } = contact;
      let currentMessage = firstMessage;
      let isFirstMessage = true;

      while (currentMessage && !errorMessage) {
        const [sendObject, error] = await WhatsappService.sendMessageToContact(
          instancePhoneNumber,
          currentMessage,
          phoneNumber
        );

        console.log('sendObject', sendObject);

        if (error || sendObject?.erro) {
          errorMessage = error?.message;
          break;
        }

        if (isFirstMessage) {
          await CampaignContact.create({
            campaign: campaignId,
            contact: contact._id,
            status: 'IN_PROGRESS',
            last_message: firstMessage._id,
            chat_id: sendObject.to?.remote?._serialized || null,
          });

          isFirstMessage = false;

          totalSent += 1;
        } else {
          await CampaignContact.updateOne(
            { campaign: campaignId, contact: contact._id },
            { last_message: currentMessage._id }
          );
        }

        currentMessage = await MessageService.getMessageById(currentMessage.next_message);
        console.log('currentMessage', currentMessage);
      }

      if (errorMessage) {
        break;
      }

      await Sleep(5000);
    }
  }

  await Campaign.updateOne(
    { _id: campaign._id },
    {
      initialization_status: errorMessage ? 'ERROR' : 'COMPLETED',
      error: errorMessage,
    }
  );

  return totalSent;
};

module.exports = {
  initializeCampaign,
};
