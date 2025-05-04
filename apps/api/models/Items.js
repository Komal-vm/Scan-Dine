// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   price: Number,
//   imageLink: String,
//   published: Boolean,
// });

// module.exports = mongoose.model('Items', courseSchema);
const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
  title: String,
  description: String, 
  price: Number,
  imageLink: String,
  published:  { type: Boolean, default: false },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

module.exports = mongoose.model('Items', itemsSchema);
