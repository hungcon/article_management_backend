const userInfoService = require('../../services/userinfo');

const getUserInfo = async (req, res) => {
  const { userName } = req.body;
  const userInfo = await userInfoService.getUserInfo(userName);
  return res.send(userInfo);
};

module.exports = { getUserInfo };
