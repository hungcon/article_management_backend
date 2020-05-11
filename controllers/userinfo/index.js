const userInfoService = require('../../services/userinfo');

const getUserInfo = async (req, res) => {
  const { userName } = req.body;
  const userInfo = await userInfoService.getUserInfo(userName);
  return res.send(userInfo);
};

const getListAccounts = async (req, res) => {
  const listAccounts = await userInfoService.getListAccounts();
  return res.send(listAccounts);
};

module.exports = { getUserInfo, getListAccounts };
