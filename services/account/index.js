const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Account = require('../../models/account');
const UserInfor = require('../../models/userInfor');

dotenv.config();
const { PRIVATE_KEY } = process.env;

const signIn = async (userName, password) => {
  const user = await Account.findOne({ userName });
  if (!user) {
    return {
      success: false,
      err: 'Account do not exist',
      token: null,
    };
  }
  const isCorrectPassword = await user.isCorrectPassword(password);
  if (!isCorrectPassword) {
    return {
      success: false,
      err: 'Incorrect password',
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

const createAccount = async (userName, password, firstName, lastName) => {
  const account = {
    userName,
    password,
  };
  const userInfor = {
    userName,
    password,
    firstName,
    lastName,
  };
  await Account.create(account);
  const currentUser = await UserInfor.create(userInfor);
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
module.exports = {
  createAccount,
  signIn,
  isAccountExisted,
};
