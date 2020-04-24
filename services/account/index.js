const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Account = require('../../models/account');

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
  const payload = { userName };
  const token = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: '1h',
  });
  return {
    success: true,
    err: false,
    token,
  };
};

const createAccount = async (account) => {
  const currentUser = await Account.create(account);
  return currentUser;
};
module.exports = {
  createAccount,
  signIn,
};
