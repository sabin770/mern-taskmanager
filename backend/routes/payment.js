const express = require('express');
const { protect } = require('../middleware/auth');
const { initiatePayment, verifyPayment, PLANS } = require('../services/khaltiService');
const { sendPurchaseReceipt } = require('../services/emailService');
const Payment = require('../models/Payment');
const User = require('../models/User');

const router = express.Router();
router.use(protect);

// @route  GET /api/payment/plans
// @desc   Get available plans
// @access Private
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: 'monthly',
        name: 'Monthly Premium',
        price: PLANS.monthly.amountNPR,
        priceFormatted: `NPR ${PLANS.monthly.amountNPR}`,
        period: 'month',
        features: [
          'Email reminders for due tasks',
          'Overdue task alerts',
          'Daily digest at 8 AM',
          'Priority-based notifications',
        ],
      },
      {
        id: 'yearly',
        name: 'Yearly Premium',
        price: PLANS.yearly.amountNPR,
        priceFormatted: `NPR ${PLANS.yearly.amountNPR}`,
        period: 'year',
        savings: 'Save NPR 589',
        features: [
          'Everything in Monthly',
          'Save 16% vs monthly',
          'Priority support',
          'Early access to features',
        ],
      },
    ],
  });
});

// @route  POST /api/payment/initiate
// @desc   Initiate Khalti payment
// @access Private
router.post('/initiate', async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    // Check if already premium
    if (req.user.isPremium && req.user.checkPremiumActive()) {
      return res.status(400).json({ success: false, message: 'You already have an active premium plan' });
    }

    const result = await initiatePayment({
      plan,
      userId: req.user._id.toString(),
      userEmail: req.user.email,
      userName: req.user.name,
    });

    // Save pending payment
    await Payment.create({
      user: req.user._id,
      pidx: result.pidx,
      amount: result.amount,
      amountNPR: result.amountNPR,
      plan,
      status: 'pending',
    });

    res.json({
      success: true,
      paymentUrl: result.payment_url,
      pidx: result.pidx,
    });
  } catch (error) {
    console.error('Khalti initiate error:', error.response?.data || error.message);
    next(error);
  }
});

// @route  POST /api/payment/verify
// @desc   Verify payment after Khalti redirect
// @access Private
router.post('/verify', async (req, res, next) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ success: false, message: 'pidx is required' });
    }

    // Find the pending payment
    const payment = await Payment.findOne({ pidx, user: req.user._id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (payment.status === 'completed') {
      return res.json({ success: true, message: 'Payment already verified', payment });
    }

    // Verify with Khalti
    const khaltiData = await verifyPayment(pidx);

    if (khaltiData.status !== 'Completed') {
      payment.status = 'failed';
      payment.khaltiResponse = khaltiData;
      await payment.save();
      return res.status(400).json({ success: false, message: `Payment not completed. Status: ${khaltiData.status}` });
    }

    // Update payment record
    payment.status = 'completed';
    payment.transactionId = khaltiData.transaction_id;
    payment.khaltiResponse = khaltiData;
    await payment.save();

    // Grant premium to user
    const expiry = payment.plan === 'yearly'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        premiumSince: new Date(),
        premiumExpiry: expiry,
      },
      { new: true }
    );

    // Send receipt email
    try {
      await sendPurchaseReceipt({ user: updatedUser, payment });
      console.log(`📧 Receipt sent to ${updatedUser.email}`);
    } catch (emailErr) {
      console.error('Receipt email failed:', emailErr.message);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified! Premium activated.',
      payment,
      premiumExpiry: expiry,
    });
  } catch (error) {
    console.error('Khalti verify error:', error.response?.data || error.message);
    next(error);
  }
});

// @route  GET /api/payment/history
// @desc   Get user's payment history
// @access Private
router.get('/history', async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id, status: 'completed' })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    next(error);
  }
});

// @route  GET /api/payment/status
// @desc   Get current premium status
// @access Private
router.get('/status', async (req, res) => {
  const user = req.user;
  const isActive = user.checkPremiumActive();

  res.json({
    success: true,
    isPremium: isActive,
    premiumSince: user.premiumSince,
    premiumExpiry: user.premiumExpiry,
    daysLeft: isActive && user.premiumExpiry
      ? Math.ceil((new Date(user.premiumExpiry) - new Date()) / (1000 * 60 * 60 * 24))
      : null,
  });
});

// @route  PUT /api/payment/notifications
// @desc   Update notification preferences
// @access Private (Premium only)
router.put('/notifications', async (req, res, next) => {
  try {
    if (!req.user.checkPremiumActive()) {
      return res.status(403).json({ success: false, message: 'Premium subscription required' });
    }

    const { emailReminders, reminderHoursBefore } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'notifications.emailReminders': emailReminders,
        'notifications.reminderHoursBefore': reminderHoursBefore,
      },
      { new: true }
    );

    res.json({ success: true, notifications: user.notifications });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
