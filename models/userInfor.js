const mongoose = require('mongoose');

const UserInforSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});
const UserInfor = mongoose.model('UserInfor', UserInforSchema);
module.exports = UserInfor;
