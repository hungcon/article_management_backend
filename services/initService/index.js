const Account = require('../../models/account');

const generateAccount = async () => {
  const account = await Account.findOne({ userName: 'hungcon.5070@gmail.com' });
  if (!account) {
    await Account.create({
      userName: 'hungcon.5070@gmail.com',
      password: 'hungcon19111997',
      role: 'admin',
      websites: [],
    });
  }
};

module.exports = {
  generateAccount,
};
