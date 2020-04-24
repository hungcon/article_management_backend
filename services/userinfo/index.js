const UserInfor = require('../../models/userInfor');

const getUserInfo = async (userName) => {
  const userInfor = UserInfor.findOne({ userName });
  return userInfor;
};
module.exports = {
  getUserInfo,
};
