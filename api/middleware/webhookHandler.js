const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Đảm bảo bạn đã cài đặt stripe package và thêm STRIPE_SECRET_KEY vào .env
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET; // Thêm STRIPE_ENDPOINT_SECRET vào .env từ Stripe Dashboard

const handlePaymentSuccess = async (transactionId, amount, accountId) => {
  // Logic để cập nhật số dư ví của người dùng trong cơ sở dữ liệu
  console.log(`Updated account ${accountId} with amount ${amount}`);
  // Thực hiện cập nhật số dư ví trong cơ sở dữ liệu ở đây
};

const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Xử lý sự kiện
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { id: transactionId, amount, metadata } = paymentIntent;
    const accountId = metadata.accountId;

    // Cập nhật số dư ví của người dùng
    await handlePaymentSuccess(transactionId, amount, accountId);
  }

  res.status(200).send('Received');
};

module.exports = webhookHandler;
