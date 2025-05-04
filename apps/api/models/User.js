// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   purchasedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
// });

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items'
  }],
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

module.exports = mongoose.model('User', userSchema);
