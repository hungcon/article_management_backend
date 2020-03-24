/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error.');
  console.error(err);
  process.exit();
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB: ${MONGODB_URI}`);
});
