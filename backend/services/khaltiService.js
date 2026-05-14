const axios = require('axios');

const KHALTI_URL = process.env.KHALTI_URL || 'https://dev.khalti.com/api/v2/';
const SECRET_KEY = process.env.KHALTI_LIVE_SECRET_KEY;

const PLANS = {
  monthly: { amount: 29900, label: 'Monthly Premium', amountNPR: 299 },  // NPR 299
  yearly:  { amount: 199900, label: 'Yearly Premium',  amountNPR: 1999 }, // NPR 1999
};

// Step 1: Initiate payment — get pidx + payment URL
const initiatePayment = async ({ plan, userId, userEmail, userName }) => {
  const { amount, label, amountNPR } = PLANS[plan];

  const payload = {
    return_url: process.env.KHALTI_AFTER_PAYMENT_URL,
    website_url: process.env.CLIENT_URL || 'http://localhost:3000',
    amount,          // in paisa
    purchase_order_id: `TF-${userId}-${Date.now()}`,
    purchase_order_name: `TaskFlow ${label}`,
    customer_info: {
      name: userName,
      email: userEmail,
    },
  };

  const { data } = await axios.post(`${KHALTI_URL}epayment/initiate/`, payload, {
    headers: { Authorization: `Key ${SECRET_KEY}` },
  });

  return { ...data, amount, amountNPR, plan };
};

// Step 2: Verify payment after redirect — confirm with Khalti
const verifyPayment = async (pidx) => {
  const { data } = await axios.post(
    `${KHALTI_URL}epayment/lookup/`,
    { pidx },
    { headers: { Authorization: `Key ${SECRET_KEY}` } }
  );
  return data;
};

module.exports = { initiatePayment, verifyPayment, PLANS };
