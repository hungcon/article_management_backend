const UserInfor = require('../../models/userInfor');
const Account = require('../../models/account');

const getUserInfo = async (userName) => {
  const userInfor = await UserInfor.findOne({ userName });
  const { role } = await Account.findOne({ userName });
  const userInfo = {
    userName: userInfor.userName,
    firstName: userInfor.firstName,
    lastName: userInfor.lastName,
    role,
  };
  return userInfo;
};

const getListAccounts = async () => {
  const accounts = await Account.find({});
  const listAccounts = [];
  for (const account of accounts) {
    const temp = {
      role: account.role,
      _id: account._id,
      userName: account.userName,
      firstName: (await UserInfor.findOne({ userName: account.userName }))
        .firstName,
      lastName: (await UserInfor.findOne({ userName: account.userName }))
        .lastName,
    };
    listAccounts.push(temp);
  }
  return listAccounts;
};
module.exports = {
  getUserInfo,
  getListAccounts,
};
