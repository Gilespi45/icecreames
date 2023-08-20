const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/icevending', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define IceCream schema
const iceCreamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const IceCream = mongoose.model('IceCream', iceCreamSchema);

// Define Order schema
const orderSchema = new mongoose.Schema({
  ref_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IceCream',
    required: true,
  },
  noscope: {
    type: Number,
    required: true,
  },
  container: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

// API routes
app.get('/icecreams', async (req, res) => {
  try {
    const iceCreams = await IceCream.find({});
    res.json(iceCreams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('ref_id');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/orders', async (req, res) => {
  const { ref_id, noscope, container, price } = req.body;

  try {
    const iceCream = await IceCream.findById(ref_id);
    if (!iceCream) {
      return res.status(404).json({ error: 'Ice Cream not found' });
    }

    const order = new Order({
      ref_id: iceCream._id,
      noscope,
      container,
      price,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/orders/:id', async (req, res) => {
  const orderId = req.params.id;

  try {
    await Order.findByIdAndDelete(orderId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/',(req,res)=>{
  res.json({massaege:"succesfull"})
})

app.put('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  const { noscope, container, price } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        noscope,
        container,
        price,
      },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.json({ error: 'Server error' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
