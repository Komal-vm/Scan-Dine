const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
 
  password: {
    type: String,
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
});

module.exports = mongoose.model('Chef', chefSchema);
