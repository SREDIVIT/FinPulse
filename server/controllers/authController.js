import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import Goal from '../models/Goal.js';
import Subscription from '../models/Subscription.js';
import Notification from '../models/Notification.js';
import Otp from '../models/Otp.js';
import { sendOtpEmail } from '../utils/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fintrack_jwt_super_secret_key_2026', {
    expiresIn: '30d'
  });
};

const SEED_TRANSACTIONS = [
  { description: 'Salary', amount: 50000, category: 'Salary', type: 'income', date: '2026-08-01', paymentMethod: 'Bank Transfer', notes: 'Monthly corporate salary' },
  { description: 'Swiggy', amount: 650, category: 'Food', type: 'expense', date: '2026-08-08', paymentMethod: 'UPI', notes: 'Dinner delivery' },
  { description: 'Swiggy', amount: 1200, category: 'Food', type: 'expense', date: '2026-08-07', paymentMethod: 'UPI', notes: 'Weekend party lunch' },
  { description: 'Swiggy', amount: 800, category: 'Food', type: 'expense', date: '2026-08-05', paymentMethod: 'UPI', notes: 'Office lunch' },
  { description: 'Zomato', amount: 1550, category: 'Food', type: 'expense', date: '2026-08-03', paymentMethod: 'Card', notes: 'Family dinner' },
  { description: 'Uber', amount: 350, category: 'Transport', type: 'expense', date: '2026-08-08', paymentMethod: 'UPI', notes: 'Commute to client office' },
  { description: 'Uber', amount: 1150, category: 'Transport', type: 'expense', date: '2026-08-04', paymentMethod: 'Card', notes: 'Airport ride' },
  { description: 'Amazon', amount: 2500, category: 'Shopping', type: 'expense', date: '2026-08-05', paymentMethod: 'Card', notes: 'Books and home decor' },
  { description: 'Myntra', amount: 2300, category: 'Shopping', type: 'expense', date: '2026-08-06', paymentMethod: 'UPI', notes: 'Casual apparel' },
  { description: 'Electricity Bill', amount: 1800, category: 'Bills', type: 'expense', date: '2026-08-04', paymentMethod: 'Bank Transfer', notes: 'August power bill' },
  { description: 'Internet', amount: 999, category: 'Bills', type: 'expense', date: '2026-08-03', paymentMethod: 'Bank Transfer', notes: 'Broadband charge' },
  { description: 'Cloud Storage', amount: 130, category: 'Bills', type: 'expense', date: '2026-08-02', paymentMethod: 'UPI', notes: 'iCloud storage renewal' },
  { description: 'Spotify', amount: 119, category: 'Entertainment', type: 'expense', date: '2026-08-05', paymentMethod: 'Card', notes: 'Music streaming premium' },
  { description: 'Netflix', amount: 649, category: 'Entertainment', type: 'expense', date: '2026-08-02', paymentMethod: 'Card', notes: '4K monthly plan' },
  { description: 'Cinema', amount: 732, category: 'Entertainment', type: 'expense', date: '2026-08-06', paymentMethod: 'UPI', notes: 'Movie tickets' }
];

const SEED_BUDGETS = [
  { category: 'Food', limit: 5000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { category: 'Transport', limit: 3000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { category: 'Shopping', limit: 4000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { category: 'Bills', limit: 5000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { category: 'Entertainment', limit: 2500, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 }
];

const SEED_GOALS = [
  { name: 'New Laptop', target: 80000, saved: 45000, deadline: '2026-12-31', notes: 'MacBook Pro M3 configuration' },
  { name: 'Emergency Fund', target: 100000, saved: 60000, deadline: '2027-06-30', notes: '6 months of core living expenses' },
  { name: 'Vacation', target: 50000, saved: 25000, deadline: '2026-10-15', notes: 'Trip to Himachal Pradesh' }
];

const SEED_SUBSCRIPTIONS = [
  { name: 'Netflix', cost: 649, billingCycle: 'monthly', category: 'Entertainment', nextPayment: '2026-08-15', status: 'active' },
  { name: 'Spotify', cost: 119, billingCycle: 'monthly', category: 'Entertainment', nextPayment: '2026-08-18', status: 'active' },
  { name: 'Internet', cost: 999, billingCycle: 'monthly', category: 'Bills', nextPayment: '2026-08-20', status: 'active' },
  { name: 'Cloud Storage', cost: 130, billingCycle: 'monthly', category: 'Bills', nextPayment: '2026-08-22', status: 'active' }
];

const SEED_NOTIFICATIONS = [
  { title: 'Budget threshold crossed', message: 'Food budget is 84% used.', type: 'warning', read: false },
  { title: 'Savings goal progress', message: 'Savings goal "New Laptop" increased by ₹5,000.', type: 'success', read: false },
  { title: 'Payment upcoming', message: 'Netflix payment of ₹649 due soon.', type: 'warning', read: true }
];

export const seedDefaultUserData = async (userId) => {
  try {
    await Transaction.insertMany(SEED_TRANSACTIONS.map(t => ({ ...t, userId })));
    await Budget.insertMany(SEED_BUDGETS.map(b => ({ ...b, userId })));
    await Goal.insertMany(SEED_GOALS.map(g => ({ ...g, userId })));
    await Subscription.insertMany(SEED_SUBSCRIPTIONS.map(s => ({ ...s, userId })));
    await Notification.insertMany(SEED_NOTIFICATIONS.map(n => ({ ...n, userId })));
  } catch (err) {
    console.error('Error seeding initial user data:', err.message);
  }
};

// @desc Register user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, currency, monthlyIncome, phone, financialGoals } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      currency: currency || 'INR',
      monthlyIncome: monthlyIncome || 50000,
      phone: phone || '+91 98765 43210',
      financialGoals: financialGoals || 'Save for laptop, Build emergency fund'
    });

    // Seed initial user demo data so charts populate immediately
    await seedDefaultUserData(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyIncome: user.monthlyIncome,
      phone: user.phone,
      financialGoals: user.financialGoals,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyIncome: user.monthlyIncome,
        phone: user.phone,
        financialGoals: user.financialGoals,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Google Login / Auto-provision
// @route POST /api/auth/google
export const googleLoginUser = async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const userEmail = (email || 'google.user@finpulse.ai').toLowerCase();
    const userName = name || 'Google User';

    let user = await User.findOne({ email: userEmail });

    if (!user) {
      user = await User.create({
        name: userName,
        email: userEmail,
        password: `google_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        currency: 'INR',
        monthlyIncome: 60000,
        phone: '+91 98765 43210',
        financialGoals: 'Emergency Fund, Investments'
      });
      // Seed default transactions & budget so user sees data immediately
      await seedDefaultUserData(user._id);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyIncome: user.monthlyIncome,
      phone: user.phone,
      financialGoals: user.financialGoals,
      avatar: avatar || null,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.currency = req.body.currency || user.currency;
      user.monthlyIncome = req.body.monthlyIncome !== undefined ? req.body.monthlyIncome : user.monthlyIncome;
      user.financialGoals = req.body.financialGoals !== undefined ? req.body.financialGoals : user.financialGoals;

      if (req.body.newPassword) {
        if (!req.body.oldPassword) {
          return res.status(400).json({ message: 'Current password is required to change password' });
        }
        const isMatch = await user.matchPassword(req.body.oldPassword);
        if (!isMatch) {
          return res.status(400).json({ message: 'Current password does not match' });
        }
        user.password = req.body.newPassword;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        currency: updatedUser.currency,
        monthlyIncome: updatedUser.monthlyIncome,
        phone: updatedUser.phone,
        financialGoals: updatedUser.financialGoals
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Send 6-digit OTP code to user's email
// @route POST /api/auth/send-otp
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });
    const userName = user ? user.name : trimmedEmail.split('@')[0];

    // Generate random 6-digit verification code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean up old OTPs for this email
    await Otp.deleteMany({ email: trimmedEmail });

    // Store in MongoDB with 10-minute expiry
    await Otp.create({
      email: trimmedEmail,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send the actual email
    const emailResult = await sendOtpEmail({
      to: trimmedEmail,
      otp: otpCode,
      userName
    });

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${trimmedEmail}.`,
      previewUrl: emailResult.previewUrl,
      isTestAccount: emailResult.isTestAccount,
      devOtp: !process.env.EMAIL_USER ? otpCode : undefined
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: `Could not send verification email: ${error.message}` });
  }
};

// @desc Reset user password with OTP verification
// @route POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'Verification code is required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Verify OTP from database
    const storedOtp = await Otp.findOne({ email: trimmedEmail, otp: otp.toString().trim() });
    if (!storedOtp) {
      return res.status(400).json({ message: 'Invalid or expired verification code. Please check your email or request a new code.' });
    }

    // Find and update user in MongoDB
    let user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ message: 'No account registered with this email address' });
    }

    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ email: trimmedEmail });

    res.json({ message: 'Password reset successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

