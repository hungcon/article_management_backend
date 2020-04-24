const accountService = require('../../services/account');

const signIn = async (req, res) => {
  const { userName, password } = req.body;
  const accessToken = await accountService.signIn(userName, password);
  return res.send({ accessToken });
};

const isAccountExisted = async (req, res) => {
  const { userName } = req.body;
  const account = await accountService.isAccountExisted(userName);
  return res.send({ account });
};

const createAccount = async (req, res) => {
  const { userName, password, firstName, lastName } = req.body;
  const currentUser = await accountService.createAccount(
    userName,
    password,
    firstName,
    lastName,
  );
  return res.send({ currentUser });
};

module.exports = {
  createAccount,
  signIn,
  isAccountExisted,
};
