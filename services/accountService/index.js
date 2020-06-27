const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Account = require('../../models/account');
const Website = require('../../models/website');

dotenv.config();
const { PRIVATE_KEY } = process.env;

const signIn = async (userName, password) => {
  const user = await Account.findOne({ userName });
  if (!user) {
    return {
      success: false,
      err: 'Tài khoản không tồn tại',
      token: null,
    };
  }
  const isCorrectPassword = await user.isCorrectPassword(password);
  if (!isCorrectPassword) {
    return {
      success: false,
      err: 'Mật khẩu không đúng',
      token: null,
    };
  }
  const payload = { userName: user.userName, role: user.role };
  const token = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: '10h',
  });
  return {
    success: true,
    err: false,
    token,
  };
};

const getListAccounts = async () => {
  const listAccount = await Account.find({}).populate({
    path: 'websites',
    model: Website,
  });
  return listAccount;
};

const getUserInfo = async (userName) => {
  const currentUser = await Account.findOne({ userName }).populate({
    path: 'websites',
    model: Website,
  });
  return currentUser;
};

const getAccount = async (accountId) => {
  const currentUser = await Account.findOne({ _id: accountId }).populate({
    path: 'websites',
    model: Website,
  });
  return currentUser;
};

const createAccount = async (userName, password) => {
  const account = {
    userName,
    password,
  };
  await Account.create(account);
  const currentUser = {};
  const payload = { userName: currentUser.userName, role: currentUser.role };
  const token = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: '10h',
  });
  return {
    success: true,
    err: false,
    token,
  };
};

const isAccountExisted = async (userName) => {
  const currentUser = await Account.findOne({ userName });
  return currentUser;
};

const addAccount = async (account) => {
  await Account.create({
    userName: account.userName,
    password: account.password,
    role: account.role,
    websites: account.websites,
  });
  return { status: 1 };
};

const updateAccount = async (account) => {
  await Account.findOneAndUpdate(
    { userName: account.userName },
    {
      $set: {
        role: account.role,
        websites: account.websites,
      },
    },
  );
  return { status: 1 };
};

const updatePassword = async (userName, password) => {
  const SALT_ROUNDS = 10;
  const newHashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await Account.findOneAndUpdate(
    { userName },
    {
      password: newHashedPassword,
    },
  );
  return { status: 1 };
};

const deleteAccount = async (accountId) => {
  await Account.findOneAndDelete({ _id: accountId });
  return { status: 1 };
};
module.exports = {
  createAccount,
  getListAccounts,
  getUserInfo,
  getAccount,
  signIn,
  isAccountExisted,
  addAccount,
  updateAccount,
  updatePassword,
  deleteAccount,
};
