import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMongoUri, maskUri } from './config/db.js';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
import Budget from './models/Budget.js';
import Goal from './models/Goal.js';
import Subscription from './models/Subscription.js';
import Notification from './models/Notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const DEMO_USER = {
  name: 'Sredivit',
  email: 'sredivit@finpulse.ai',
  password: 'password123',
  currency: 'INR',
  monthlyIncome: 50000,
  phone: '+91 98765 43210',
  financialGoals: 'Save for laptop, Build emergency fund'
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

const connect = async () => {
  const uri = getMongoUri();
  const safeUri = maskUri(uri);
  try {
    console.log(`[Seeder] Connecting to MongoDB (${safeUri})...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seeder] Connected to MongoDB successfully.');
  } catch (err) {
    console.error(`[Seeder] Could not connect to MongoDB: ${err.message}`);
    console.error(`[Seeder] Please check MONGO_URI in your .env file.`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connect();

    // Check or delete demo user
    let user = await User.findOne({ email: DEMO_USER.email.toLowerCase() });
    if (user) {
      console.log(`[Seeder] Clearing old records for existing demo user: ${DEMO_USER.email}...`);
      await Transaction.deleteMany({ userId: user._id });
      await Budget.deleteMany({ userId: user._id });
      await Goal.deleteMany({ userId: user._id });
      await Subscription.deleteMany({ userId: user._id });
      await Notification.deleteMany({ userId: user._id });
    } else {
      console.log(`[Seeder] Creating demo user: ${DEMO_USER.email}...`);
      user = await User.create(DEMO_USER);
    }

    const userId = user._id;

    console.log('[Seeder] Seeding transactions...');
    await Transaction.insertMany(SEED_TRANSACTIONS.map(t => ({ ...t, userId })));

    console.log('[Seeder] Seeding budgets...');
    await Budget.insertMany(SEED_BUDGETS.map(b => ({ ...b, userId })));

    console.log('[Seeder] Seeding savings goals...');
    await Goal.insertMany(SEED_GOALS.map(g => ({ ...g, userId })));

    console.log('[Seeder] Seeding recurring subscriptions...');
    await Subscription.insertMany(SEED_SUBSCRIPTIONS.map(s => ({ ...s, userId })));

    console.log('[Seeder] Seeding notifications...');
    await Notification.insertMany(SEED_NOTIFICATIONS.map(n => ({ ...n, userId })));

    console.log('\n=============================================');
    console.log('🎉 FinTrack Database Seeded Successfully!');
    console.log(`👤 Demo User Email:    ${DEMO_USER.email}`);
    console.log(`🔑 Demo User Password: ${DEMO_USER.password}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connect();
    console.log('[Seeder] Wiping all data collections...');
    await User.deleteMany();
    await Transaction.deleteMany();
    await Budget.deleteMany();
    await Goal.deleteMany();
    await Subscription.deleteMany();
    await Notification.deleteMany();

    console.log('🗑️ All FinTrack data deleted successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
