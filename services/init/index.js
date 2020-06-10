const Account = require('../../models/account');
const UserInfor = require('../../models/userInfor');

const generateAccount = async () => {
  await Account.create({
    userName: 'admin',
    password: '123456',
    role: 'admin',
  });
  await UserInfor.create({
    userName: 'admin',
    firstName: 'Phùng',
    lastName: 'Hưng',
  });
};

module.exports = {
  generateAccount,
};
