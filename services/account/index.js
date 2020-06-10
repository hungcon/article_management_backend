const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Account = require('../../models/account');
const UserInfor = require('../../models/userInfor');

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

const addAccount = async (account) => {
  await Account.create({
    userName: account.userName,
    password: account.password,
  });
  await UserInfor.create({
    userName: account.userName,
    firstName: account.firstName,
    lastName: account.lastName,
  });
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
  const { userName } = await Account.findOne({ _id: accountId });
  await UserInfor.findOneAndDelete({ userName });
  await Account.findOneAndDelete({ _id: accountId });
  return { status: 1 };
};
module.exports = {
  createAccount,
  signIn,
  isAccountExisted,
  addAccount,
  updatePassword,
  deleteAccount,
};
