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
module.exports = {
  getUserInfo,
};
