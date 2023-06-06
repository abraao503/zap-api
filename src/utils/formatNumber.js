const formatNumber = (number = '') => {
  if (number.includes('@c.us')) {
    return number;
  }

  if (number.length === 12 && number.startsWith('55')) {
    const DDI = '55';
    const phoneNumber = number.substring(2, 12);

    if (phoneNumber.length === 10) {
      return `${DDI}${phoneNumber}@c.us`;
    }

    if (phoneNumber.length === 11) {
      const ddd = phoneNumber.substring(0, 2);
      return `${DDI}${ddd}${phoneNumber.substring(3)}@c.us`;
    }
  }

  return `${number}@c.us`;
};

module.exports = formatNumber;
