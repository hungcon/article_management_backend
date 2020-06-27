const accountService = require('../../services/accountService');

const signIn = async (req, res) => {
  const { userName, password } = req.body;
  const accessToken = await accountService.signIn(userName, password);
  return res.send({ accessToken });
};

const getListAccounts = async (req, res) => {
  const listAccount = await accountService.getListAccounts();
  return res.send(listAccount);
};

const getUserInfo = async (req, res) => {
  const { userName } = req.body;
  const currentUser = await accountService.getUserInfo(userName);
  return res.send({ currentUser });
};

const getAccount = async (req, res) => {
  const { accountId } = req.body;
  const currentUser = await accountService.getAccount(accountId);
  return res.send({ currentUser });
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

const addAccount = async (req, res) => {
  const { account } = req.body;
  await accountService.addAccount(account);
  return res.send({ status: 1 });
};

const updateAccount = async (req, res) => {
  const { account } = req.body;
  await accountService.updateAccount(account);
  return res.send({ status: 1 });
};

const updatePassword = async (req, res) => {
  const { userName, password } = req.body;
  await accountService.updatePassword(userName, password);
  return res.send({ status: 1 });
};

const deleteAccount = async (req, res) => {
  const { accountId } = req.body;
  await accountService.deleteAccount(accountId);
  return res.send({ status: 1 });
};

module.exports = {
  createAccount,
  getListAccounts,
  getUserInfo,
  getAccount,
  signIn,
  isAccountExisted,
  deleteAccount,
  addAccount,
  updateAccount,
  updatePassword,
};
