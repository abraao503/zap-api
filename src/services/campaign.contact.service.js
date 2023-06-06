const { CampaignContact, Contact } = require('../models');

const findByPhoneNumber = async (phoneNumber) => {
  let contact = null;
  const number = phoneNumber.split('@')[0];

  console.log('number', number);

  // números do Brasil
  if (number.length === 12 && number.startsWith('55')) {
    const DDD = number.substring(2, 4);
    const numberWithoutDDD = number.substring(4, 12);

    console.log([`55${DDD}${numberWithoutDDD}`, `55${DDD}9${numberWithoutDDD}`]);

    contact = await Contact.findOne({
      phone_number: {
        $in: [`55${DDD}${numberWithoutDDD}`, `55${DDD}9${numberWithoutDDD}`],
      },
    });
  } else {
    contact = await Contact.findOne({
      phone_number: number,
    });
  }

  console.log('contact', contact);

  if (contact) {
    const campaignContact = await CampaignContact.findOne({
      contact: contact._id,
      status: 'IN_PROGRESS',
    })
      .sort({ createdAt: -1 })
      .populate('last_message');

    return campaignContact;
  }

  return null;
};

const getContactsByCampaing = async (campaignId) => {
  const campaignContacts = await CampaignContact.find({
    campaign: campaignId,
    status: 'IN_PROGRESS',
  }).populate('contact');

  const contacts = campaignContacts.map((campaignContact) => campaignContact.contact);
  return contacts;
};

const updateCampaignContact = async (campaignContactId, campaignContactBody) => {
  return CampaignContact.updateOne({ _id: campaignContactId }, campaignContactBody);
};

module.exports = {
  findByPhoneNumber,
  updateCampaignContact,
  getContactsByCampaing,
};
