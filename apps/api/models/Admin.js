// const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// module.exports = mongoose.model('Admin', adminSchema);
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  restaurantName: String // unique restaurant identity
});

module.exports = mongoose.model('Admin', adminSchema);
