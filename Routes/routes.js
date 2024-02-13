const express = require('express');
const router = express.Router();
//const Razorpay = require('razorpay');
const  PaymentModel = require('../Model/Model.js');
module.exports = function (razorpayInstance) {
// Function to calculate total amount including GST
function calculateTotal(amount) {
  const gstPercentage = 18; // GST percentage
  const totalAmount = amount + (amount * gstPercentage) / 100;
  return totalAmount;
}

// Route controller function to handle payment initiation
router.post('/purchase', async (req, res) => {
    console.log("Received purchase request:", req.body); 
    const { plan, duration } = req.body;
    let amount;
  
    // Determine amount based on the selected plan and duration
    switch (plan) {
      case 'oneMonth':
        amount = calculateTotal(990);
        break;
      case 'threeMonth':
        amount = calculateTotal(900 * duration);
        break;
      case 'sixMonth':
        amount = calculateTotal(800 * duration);
        break;
      case 'twelveMonth':
        amount = calculateTotal(625 * duration);
        break;
      default:
        console.log("Invalid plan:", plan); // Log invalid plan
               
        return res.status(400).json({ error: 'Invalid plan' });
    }
   // const rupees = Math.floor(amount);
    //const paisa = Math.round((amount - rupees) * 100);
    
    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Amount in paisa
     // amount: rupees * 100 + paisa, 
      currency: 'INR',
      receipt: 'receipt_id', // You can generate this dynamically if needed
      payment_capture: 1 // Auto-capture payment
    };
  
try {
    const response = await razorpayInstance.orders.create(options); 
    const orderId = response.id;
    const Payment = new PaymentModel({
         amount,
         plan,
         duration,
         order_id: orderId 
      });
      await Payment.save();
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to create order');
    }
  });
//   router.get('/purchase/:id', async (req, res) => {
//     try {
//         const purchase = await PaymentModel.findById(req.params.id);
//         if (!purchase) {
//             return res.status(404).json({ error: 'Purchase not found' });
//         }
//         res.json(purchase);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to retrieve purchase');
//     }
// });
// router.get('/purchases', async (req, res) => {
//     try {
//         const purchases = await PaymentModel.find();
//         res.json(purchases);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to retrieve purchases');
//     }
// });
// router.delete('/purchase/:id', async (req, res) => {
//     try {
//         const deletedPurchase = await PaymentModel.findByIdAndDelete(req.params.id);
//         if (!deletedPurchase) {
//             return res.status(404).json({ error: 'Purchase not found' });
//         }
//         res.json({ message: 'Purchase deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to delete purchase');
//     }
// });
const crypto = require('crypto')


router.post('/paymentcapture', async (req, res) => {
  const secret_key = '1234567890'
  // Validate the request using Razorpay's signature
  const data = crypto.createHmac('sha256', secret_key)
                     .update(JSON.stringify(req.body))
                     .digest('hex');
  
  if (data === req.headers['x-razorpay-signature']) {
    console.log('Request is legitimate');
    
    // Retrieve orderId from the request body
    const { order_id } = req.body.payload.payment.entity;
    
    // Update payment status in the database
    try {
      const payment = await PaymentModel.findOneAndUpdate(
        { order_id },
        { $set: { payment_status: 'captured' } },
        { new: true }
      );
      console.log('Payment captured:', payment);
      res.json({ status: 'ok' });
    } catch (error) {
      console.error('Error capturing payment:', error);
      res.status(500).send('Failed to capture payment');
    }
  } else {
    console.error('Invalid signature');
    res.status(400).send('Invalid signature');
  }
});


var paymentcontroller = require("../Controller/Paymentcontroller.js");
router.route("/purchases").get(paymentcontroller.getAll);

router
  .route("/purchase/:id")
  .get(paymentcontroller.getById)
  .delete(paymentcontroller.delete);

  
  
  return router;
};

