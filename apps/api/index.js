const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const QRCode = require('qrcode');

const Admin = require('./models/Admin');
const User = require('./models/User');
const Chef = require('./models/Chef');
const Items = require('./models/Items');

const app = express();
const SECRET = "my secret";

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://komalchakradhar123:komal2025@cluster1.hgkjt.mongodb.net/Restaurant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

// Middleware
const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin Signup
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  const existingAdmin = await Admin.findOne({ username });
  if (existingAdmin) return res.status(403).json({ message: 'Admin already exists' });

  const admin = new Admin({ username, password });
  await admin.save();

  const token = jwt.sign({ username, role: 'admin',_id: admin._id  }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'Admin created successfully',token});
});

// Admin Signin
app.post('/admin/signin', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });

  if (admin) {
    const token = jwt.sign({ username, role: 'admin',_id: admin._id }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully',token});
  } else {
    res.status(403).json({ message: 'Invalid credentials' });
  }
});

// Admin Info
app.get('/admin/me',authenticateJwt,async (req, res) => {
  res.json({ username: req.user.username });
});

// Admin - Create items
app.post('/admin/additems',authenticateJwt, async (req, res) => {
  const items = new Items({
    ...req.body,
    restaurantId: req.user._id
  });
  await items.save();
  res.json({ message: 'item created successfully', itemId: items._id });
});

// Admin - Get All items
app.get('/admin/items', authenticateJwt,async (req, res) => {
  const items = await Items.find({restaurantId: req.user._id });
  res.json({ items });
});

// Admin - Update items
app.put('/admin/updateitem/:itemId',authenticateJwt,async (req, res) => {
  const updated = await Items.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
  if (updated) {
    res.json({ message: 'item updated successfully' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});


//generate QR 
app.get('/admin/generate-qr', authenticateJwt, async (req, res) => {
  try {
    const restaurantId = req.user._id; // admin's own ID
    const qrUrl = `http://localhost:3000/user/signup/${restaurantId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);
    res.json({ qrCode: qrCodeDataUrl }); // base64 image that frontend can display
  } catch (err) {
    res.status(500).json({ message: "Error generating QR", error: err.message });
  }
});

//QR for chef
app.get('/admin/generate-qr-chef', authenticateJwt, async (req, res) => {
  try {
    const restaurantId = req.user._id; // admin's own ID
    const qrUrl = `http://localhost:3000/chef/signup/${restaurantId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl);
    res.json({ qrCode: qrCodeDataUrl }); // base64 image that frontend can display
  } catch (err) {
    res.status(500).json({ message: "Error generating QR", error: err.message });
  }
});


// User Signup
app.post('/user/signup/:restaurantId', async (req, res) => {
  const { username, password } = req.body;
  const { restaurantId } = req.params;    // Extract restaurantId (restid) from route parameters

  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(403).json({ message: 'User already exists' });

  const user = new User({ username, password,restaurantId });
  await user.save();

  const token = jwt.sign({ username, role: 'user', restaurantId}, SECRET, { expiresIn: '1h' });
  res.json({ message: 'User created successfully',token});
});

// User Signin
app.post('/user/signin/:restaurantId', async (req, res) => {
  const { username, password } = req.body;
  
  const { restaurantId} = req.params;    // Extract restaurantId (restid) from route parameters

  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }
  const user = await User.findOne({ username, password });

  if (user) {
    const token = jwt.sign({ username, role: 'user',restaurantId: user.restaurantId}, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully',token });
  } else {
    res.status(403).json({ message: 'Invalid credentials' });
  }
});

// User Info
app.get('/user/me', authenticateJwt,async (req, res) => {
  res.json({ username: req.user.username });
});

// User - Get All items
app.get('/user/items', authenticateJwt,async (req, res) => {
  const restaurantId = req.user.restaurantId;
  const items = await Items.find({ restaurantId });
  res.json({ items });
});

// User - Purchase items
app.post('/user/items/:itemId', authenticateJwt,async (req, res) => {
  const items = await Items.findById(req.params.itemId);
  if (!items) return res.status(404).json({ message: 'item not found' });

  const user = await User.findOne({ username: req.user.username });
  if (!user) return res.status(403).json({ message: 'User not found' });

  user.purchasedItems.push(items._id);
  await user.save();

  res.json({ message: 'item purchased successfully' });
});

// User - Get Purchased items
app.get('/user/purchasedItems', authenticateJwt,async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedItems');
  if (!user) return res.status(403).json({ message: 'User not found' });

  res.json({ purchasedItems: user.purchasedItems });
});


// // restaurant details route
// app.get('/public/restaurant/:restaurantId', async (req, res) => {
//   const admin = await Admin.findById(req.params.restaurantId);
//   if (!admin) return res.status(404).json({ message: "Restaurant not found" });
//   res.json({ username: admin.username });
// });



// //No signin route
// app.get('/public/items/:restaurantId', async (req, res) => {
//   try {
//     const items = await Items.find({
//       restaurantId: req.params.restaurantId,
//       published: true
//     });

//     if (items.length === 0) {
//       return res.status(404).json({ message: "No items found or invalid restaurant" });
//     }

//     res.json({ items });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });




// chef Signup
app.post('/chef/signup/:restaurantId', async (req, res) => {
  const { username, password } = req.body;
  const { restaurantId } = req.params;    // Extract restaurantId (restid) from route parameters

  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }
  const existingChef = await Chef.findOne({ username });
  if (existingChef) return res.status(403).json({ message: 'User already exists' });

  const chef = new Chef({ username, password,restaurantId });
  await chef.save();

  const token = jwt.sign({  id: chef._id,username, role: 'chef', restaurantId}, SECRET, { expiresIn: '10h' });
  res.json({ message: 'chef created successfully',token});
});

//chef signin
app.post('/chef/signin/:restaurantId', async (req, res) => {
  const { username, password } = req.body;
  
  const { restaurantId} = req.params;    // Extract restaurantId (restid) from route parameters

  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }
  const chef = await Chef.findOne({ username, password });

  if (chef) {
    const token = jwt.sign({  id: chef._id,username, role: 'chef',restaurantId: chef.restaurantId}, SECRET, { expiresIn: '10h' });
    res.json({ message: 'Logged in successfully',token });
  } else {
    res.status(403).json({ message: 'Invalid credentials' });
  }
});


//chef orders route

app.get('/chef/orders', authenticateJwt, async (req, res) => {
  console.log("Decoded JWT:", req.user);
  console.log("Fetching orders for restaurant:", req.user.restaurantId);

  try {
    const chef = await Chef.findById(req.user.id);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    // Ensure that the user is authenticated as a chef and is linked to a restaurant
    const restaurantId = req.user.restaurantId; // Get restaurantId from the authenticated user (chef)
    if (!restaurantId) {
      return res.status(403).json({ message: 'Unauthorized access. No restaurant associated with chef.' });
    }

    // Step 1: Get all items from that restaurant
    const restaurantItems = await Items.find({ restaurantId }).select('_id');

    // Step 2: Extract item IDs
    const itemIds = restaurantItems.map(item => item._id);
    console.log("Found items:", itemIds);

    // Step 3: Find users who bought any of those items
    const users = await User.find({ purchasedItems: { $in: itemIds } })
      .populate('purchasedItems')
      .exec();

    console.log("Found users:", users.map(u => u.username));

    // If no orders exist for this restaurant, return a message
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No orders found for this restaurant.' });
    }

    // Aggregate all the orders into an array, grouped by user
    const orders = users.map(user => {
      // Log the user's purchased items with their restaurantIds
      console.log(`User: ${user.username}, Purchased Items:`, user.purchasedItems.map(i => ({
        id: i._id,
        restaurantId: i.restaurantId
      })));

      // Filter purchased items for this specific restaurant
      return {
        user: user.username,
        items: user.purchasedItems.filter(item => {
          // Log the comparison of restaurantIds
          console.log(`Comparing: ${item.restaurantId} === ${restaurantId}`);
          return item.restaurantId && item.restaurantId.toString() === restaurantId.toString();
        })
      };
    });

    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

  

// Start server
app.listen(4000, () => {
  console.log('🚀 Server listening on port 4000');
});
