const Account = require('../../models/account');

const generateAccount = async () => {
  await Account.create({
    userName: 'admin',
    password: '123456',
    role: 'admin',
    websites: [],
  });
};

module.exports = {
  generateAccount,
};
