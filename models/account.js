/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;
const SALT_ROUNDS = 10;

const AccountSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
  },
  websites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Website',
    },
  ],
});

AccountSchema.pre('save', function (next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, SALT_ROUNDS, function (err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

AccountSchema.methods.isCorrectPassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, same) {
      if (err) {
        return reject(err);
      }
      return resolve(same);
    });
  });
};

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
