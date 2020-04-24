const accountService = require('../../services/account');

const signIn = async (req, res) => {
  const { userName, password } = req.body;
  const accessToken = await accountService.signIn(userName, password);
  return res.send({ accessToken });
};

const createAccount = async (req, res) => {
  const account = await accountService.createAccount(req.body);
  return res.send({ currentUser: account });
};

module.exports = {
  createAccount,
  signIn,
};
