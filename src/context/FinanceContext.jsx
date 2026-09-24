import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const FinanceContext = createContext();

const INITIAL_TRANSACTIONS = [
  { id: 't1', description: 'Salary', amount: 50000, category: 'Salary', type: 'income', date: '2026-08-01', paymentMethod: 'Bank Transfer', notes: 'Monthly corporate salary' },
  { id: 't2', description: 'Swiggy', amount: 650, category: 'Food', type: 'expense', date: '2026-08-08', paymentMethod: 'UPI', notes: 'Dinner delivery' },
  { id: 't3', description: 'Swiggy', amount: 1200, category: 'Food', type: 'expense', date: '2026-08-07', paymentMethod: 'UPI', notes: 'Weekend party lunch' },
  { id: 't4', description: 'Swiggy', amount: 800, category: 'Food', type: 'expense', date: '2026-08-05', paymentMethod: 'UPI', notes: 'Office lunch' },
  { id: 't5', description: 'Zomato', amount: 1550, category: 'Food', type: 'expense', date: '2026-08-03', paymentMethod: 'Card', notes: 'Family dinner' },
  { id: 't6', description: 'Uber', amount: 350, category: 'Transport', type: 'expense', date: '2026-08-08', paymentMethod: 'UPI', notes: 'Commute to client office' },
  { id: 't7', description: 'Uber', amount: 1150, category: 'Transport', type: 'expense', date: '2026-08-04', paymentMethod: 'Card', notes: 'Airport ride' },
  { id: 't8', description: 'Amazon', amount: 2500, category: 'Shopping', type: 'expense', date: '2026-08-05', paymentMethod: 'Card', notes: 'Books and home decor' },
  { id: 't9', description: 'Myntra', amount: 2300, category: 'Shopping', type: 'expense', date: '2026-08-06', paymentMethod: 'UPI', notes: 'Casual apparel' },
  { id: 't10', description: 'Electricity Bill', amount: 1800, category: 'Bills', type: 'expense', date: '2026-08-04', paymentMethod: 'Bank Transfer', notes: 'August power bill' },
  { id: 't11', description: 'Internet', amount: 999, category: 'Bills', type: 'expense', date: '2026-08-03', paymentMethod: 'Bank Transfer', notes: 'Broadband charge' },
  { id: 't12', description: 'Cloud Storage', amount: 130, category: 'Bills', type: 'expense', date: '2026-08-02', paymentMethod: 'UPI', notes: 'iCloud storage renewal' },
  { id: 't13', description: 'Spotify', amount: 119, category: 'Entertainment', type: 'expense', date: '2026-08-05', paymentMethod: 'Card', notes: 'Music streaming premium' },
  { id: 't14', description: 'Netflix', amount: 649, category: 'Entertainment', type: 'expense', date: '2026-08-02', paymentMethod: 'Card', notes: '4K monthly plan' },
  { id: 't15', description: 'Cinema', amount: 732, category: 'Entertainment', type: 'expense', date: '2026-08-06', paymentMethod: 'UPI', notes: 'Movie tickets' },
  { id: 't16', description: 'Cash Purchase', amount: 71, category: 'Other', type: 'expense', date: '2026-08-07', paymentMethod: 'Cash', notes: 'Grocery pocket change' }
];

const INITIAL_BUDGETS = [
  { id: 'b1', category: 'Food', limit: 5000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { id: 'b2', category: 'Transport', limit: 3000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { id: 'b3', category: 'Shopping', limit: 4000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { id: 'b4', category: 'Bills', limit: 5000, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 },
  { id: 'b5', category: 'Entertainment', limit: 2500, startDate: '2026-08-01', endDate: '2026-08-31', threshold: 80 }
];

const INITIAL_GOALS = [
  { id: 'g1', name: 'New Laptop', target: 80000, saved: 45000, deadline: '2026-12-31', notes: 'MacBook Pro M3 configuration' },
  { id: 'g2', name: 'Emergency Fund', target: 100000, saved: 60000, deadline: '2027-06-30', notes: '6 months of core living expenses' },
  { id: 'g3', name: 'Vacation', target: 50000, saved: 25000, deadline: '2026-10-15', notes: 'Trip to Himachal Pradesh' }
];

const INITIAL_SUBSCRIPTIONS = [
  { id: 's1', name: 'Netflix', cost: 649, billingCycle: 'monthly', category: 'Entertainment', nextPayment: '2026-08-15', status: 'active' },
  { id: 's2', name: 'Spotify', cost: 119, billingCycle: 'monthly', category: 'Entertainment', nextPayment: '2026-08-18', status: 'active' },
  { id: 's3', name: 'Internet', cost: 999, billingCycle: 'monthly', category: 'Bills', nextPayment: '2026-08-20', status: 'active' },
  { id: 's4', name: 'Cloud Storage', cost: 130, billingCycle: 'monthly', category: 'Bills', nextPayment: '2026-08-22', status: 'active' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Unusual transaction detected', message: 'Unusual ₹15,000 shopping transaction detected at Amazon.', type: 'danger', read: false, time: '2 hours ago' },
  { id: 'n2', title: 'Budget threshold crossed', message: 'Food budget is 84% used.', type: 'warning', read: false, time: '5 hours ago' },
  { id: 'n3', title: 'Savings goal progress', message: 'Savings goal "New Laptop" increased by ₹5,000.', type: 'success', read: false, time: '1 day ago' },
  { id: 'n4', title: 'Payment upcoming', message: 'Netflix payment of ₹649 due tomorrow.', type: 'warning', read: true, time: '1 day ago' },
  { id: 'n5', title: 'Financial Report Ready', message: 'Monthly financial report for July 2026 is available.', type: 'info', read: true, time: '3 days ago' }
];

const INITIAL_ANOMALIES = [
  { id: 'a1', description: 'Amazon', amount: 15000, category: 'Shopping', date: '2026-08-09', confidence: 87, message: 'This transaction is significantly higher than your normal shopping expenses.', resolved: false }
];

export const FinanceProvider = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // User Profile
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: 'Sredivit',
      email: 'sredivit@finpulse.ai',
      phone: '+91 98765 43210',
      currency: 'INR',
      monthlyIncome: 50000,
      financialGoals: 'Save for laptop, Build emergency fund',
      password: 'password123'
    };
  });

  // Auth State
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Financial collections
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [anomalies, setAnomalies] = useState(() => {
    const saved = localStorage.getItem('anomalies');
    return saved ? JSON.parse(saved) : INITIAL_ANOMALIES;
  });

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Trigger Toast Notification
  const triggerToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('anomalies', JSON.stringify(anomalies));
  }, [anomalies]);

  // Load backend data from MongoDB when authenticated
  const loadBackendData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const [txsRes, bgsRes, glsRes, sbsRes, ntsRes] = await Promise.allSettled([
        api.getTransactions(),
        api.getBudgets(),
        api.getGoals(),
        api.getSubscriptions(),
        api.getNotifications()
      ]);

      if (txsRes.status === 'fulfilled' && Array.isArray(txsRes.value) && txsRes.value.length > 0) {
        setTransactions(txsRes.value.map(t => ({ ...t, id: t._id || t.id })));
      }
      if (bgsRes.status === 'fulfilled' && Array.isArray(bgsRes.value) && bgsRes.value.length > 0) {
        setBudgets(bgsRes.value.map(b => ({ ...b, id: b._id || b.id })));
      }
      if (glsRes.status === 'fulfilled' && Array.isArray(glsRes.value) && glsRes.value.length > 0) {
        setGoals(glsRes.value.map(g => ({ ...g, id: g._id || g.id })));
      }
      if (sbsRes.status === 'fulfilled' && Array.isArray(sbsRes.value) && sbsRes.value.length > 0) {
        setSubscriptions(sbsRes.value.map(s => ({ ...s, id: s._id || s.id })));
      }
      if (ntsRes.status === 'fulfilled' && Array.isArray(ntsRes.value) && ntsRes.value.length > 0) {
        setNotifications(ntsRes.value.map(n => ({ ...n, id: n._id || n.id })));
      }
    } catch (err) {
      console.warn('Backend sync note:', err.message);
    }
  };

  useEffect(() => {
    if (user && localStorage.getItem('token')) {
      loadBackendData();
    }
  }, [user]);

  // Auth Functions
  const login = async (email, password) => {
    // 1. Try Backend API first
    try {
      const res = await api.login({ email, password });
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        setUser({ email: res.email, name: res.name, _id: res._id });
        setProfile(prev => ({
          ...prev,
          name: res.name,
          email: res.email,
          currency: res.currency || prev.currency,
          monthlyIncome: res.monthlyIncome || prev.monthlyIncome,
          phone: res.phone || prev.phone,
          financialGoals: res.financialGoals || prev.financialGoals
        }));
        triggerToast('Logged in successfully with MongoDB!');
        await loadBackendData();
        return true;
      }
    } catch (backendErr) {
      console.warn('Backend login fallback:', backendErr.message);
    }

    // 2. Fallback to Local Auth
    if (email.toLowerCase() === profile.email.toLowerCase() && password === profile.password) {
      setUser({ email, name: profile.name });
      triggerToast('Logged in (Local Mode)!');
      return true;
    } else {
      triggerToast('Invalid email or password!', 'danger');
      return false;
    }
  };

  const signup = async (name, email, password, currency) => {
    // 1. Try Backend API
    try {
      const res = await api.register({ name, email, password, currency });
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        setUser({ email: res.email, name: res.name, _id: res._id });
        setProfile(prev => ({
          ...prev,
          name: res.name,
          email: res.email,
          currency: res.currency || currency || 'INR',
          monthlyIncome: res.monthlyIncome || 50000,
          phone: res.phone || prev.phone
        }));
        triggerToast('Account created & connected to MongoDB!');
        await loadBackendData();
        return true;
      }
    } catch (backendErr) {
      console.warn('Backend signup fallback:', backendErr.message);
    }

    // 2. Fallback to Local Signup
    setProfile(prev => ({ ...prev, name, email, password, currency }));
    setUser({ email, name });
    triggerToast('Account created (Local Mode)!');
    return true;
  };

  const googleLogin = async (customUser) => {
    const googleProfile = customUser || {
      name: 'Google User',
      email: 'sredivit@finpulse.ai',
      avatar: 'https://lh3.googleusercontent.com/a/default-user'
    };

    // 1. Try Backend API
    try {
      const res = await api.googleLogin(googleProfile);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        setUser({ email: res.email, name: res.name, _id: res._id, avatar: res.avatar });
        setProfile(prev => ({
          ...prev,
          name: res.name,
          email: res.email,
          currency: res.currency || prev.currency,
          monthlyIncome: res.monthlyIncome || prev.monthlyIncome,
          phone: res.phone || prev.phone
        }));
        triggerToast('Signed in with Google (MongoDB)!');
        await loadBackendData();
        return true;
      }
    } catch (backendErr) {
      console.warn('Backend Google login fallback:', backendErr.message);
    }

    // 2. Fallback to Local Auth if backend unreachable
    setUser({ email: googleProfile.email, name: googleProfile.name, avatar: googleProfile.avatar });
    setProfile(prev => ({ ...prev, name: googleProfile.name, email: googleProfile.email }));
    triggerToast('Signed in with Google!');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    triggerToast('Logged out successfully!', 'info');
  };

  const updatePassword = (oldPass, newPass) => {
    if (oldPass !== profile.password) {
      triggerToast('Incorrect current password!', 'danger');
      return false;
    }
    setProfile(prev => ({ ...prev, password: newPass }));
    triggerToast('Password updated successfully!');
    return true;
  };

  const sendOtp = async (email) => {
    try {
      const res = await api.sendOtp(email);
      triggerToast(res?.message || 'Verification code sent to your email!');
      return { success: true, message: res?.message, previewUrl: res?.previewUrl, isTestAccount: res?.isTestAccount, devOtp: res?.devOtp };
    } catch (backendErr) {
      console.warn('Backend sendOtp fallback:', backendErr.message);
      triggerToast('Verification code sent to your email!');
      return { success: true, message: 'Verification code sent to your email.', previewUrl: null };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await api.resetPassword({ email, otp, newPassword });
      if (res) {
        setProfile(prev => prev.email.toLowerCase() === email.toLowerCase() ? { ...prev, password: newPassword } : prev);
        triggerToast('Password reset successfully!');
        return { success: true, message: res.message || 'Password updated successfully!' };
      }
    } catch (backendErr) {
      console.warn('Backend resetPassword fallback:', backendErr.message);
      if (profile.email.toLowerCase() === email.toLowerCase()) {
        setProfile(prev => ({ ...prev, password: newPassword }));
        triggerToast('Password reset successfully!');
        return { success: true, message: 'Password updated successfully!' };
      }
      return { success: false, message: backendErr.message || 'Failed to reset password.' };
    }
  };

  // Dynamic values calculation
  const getAug2026Stats = () => {
    const augTransactions = transactions.filter(t => t.date && t.date.startsWith('2026-08'));
    
    const income = augTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = augTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = Math.max(0, income - expense);
    const balance = 35000 + (income - expense - 35000);

    return { income, expense, savings, balance };
  };

  const stats = getAug2026Stats();

  // Helper: check budgets and trigger alert
  const checkBudgetThresholds = (updatedTransactions, categoryToCheck) => {
    const catBudget = budgets.find(b => b.category.toLowerCase() === categoryToCheck.toLowerCase());
    if (!catBudget) return;

    const catSpent = updatedTransactions
      .filter(t => t.category.toLowerCase() === categoryToCheck.toLowerCase() && t.type === 'expense' && t.date && t.date.startsWith('2026-08'))
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (catSpent / catBudget.limit) * 100;

    if (percentage >= 100) {
      const exists = notifications.some(n => n.message.includes(`exceeded your ${catBudget.category} budget`));
      if (!exists) {
        addNotification(
          'Budget Exceeded',
          `Alert! You have exceeded your ${catBudget.category} budget of ₹${catBudget.limit}. Spent: ₹${catSpent}.`,
          'danger'
        );
        triggerToast(`Exceeded ${catBudget.category} budget!`, 'danger');
      }
    } else if (percentage >= catBudget.threshold) {
      const exists = notifications.some(n => n.message.includes(`${catBudget.category} budget is ${Math.round(percentage)}%`));
      if (!exists) {
        addNotification(
          'Budget Warning',
          `${catBudget.category} budget is ${Math.round(percentage)}% used. Spent: ₹${catSpent} of ₹${catBudget.limit}.`,
          'warning'
        );
        triggerToast(`${catBudget.category} budget approaching limit!`, 'warning');
      }
    }
  };

  // Add Expense
  const addExpense = async (expenseData) => {
    const tempId = Date.now().toString();
    const newTx = {
      id: tempId,
      type: 'expense',
      ...expenseData,
      amount: parseFloat(expenseData.amount)
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    triggerToast(`Added expense: ${expenseData.description}`);
    checkBudgetThresholds(updated, expenseData.category);

    try {
      const savedTx = await api.createTransaction({
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        type: 'expense',
        category: expenseData.category,
        date: expenseData.date || new Date().toISOString().split('T')[0],
        paymentMethod: expenseData.paymentMethod || 'UPI',
        notes: expenseData.notes || ''
      });
      if (savedTx && (savedTx._id || savedTx.id)) {
        setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: savedTx._id || savedTx.id } : t));
      }
    } catch (err) {
      console.warn('Sync note (addExpense):', err.message);
    }
  };

  // Add Income
  const addIncome = async (incomeData) => {
    const tempId = Date.now().toString();
    const newTx = {
      id: tempId,
      type: 'income',
      ...incomeData,
      amount: parseFloat(incomeData.amount)
    };
    setTransactions([newTx, ...transactions]);
    triggerToast(`Added income: ${incomeData.description}`);

    try {
      const savedTx = await api.createTransaction({
        description: incomeData.description,
        amount: parseFloat(incomeData.amount),
        type: 'income',
        category: incomeData.category,
        date: incomeData.date || new Date().toISOString().split('T')[0],
        paymentMethod: incomeData.paymentMethod || 'Bank Transfer',
        notes: incomeData.notes || ''
      });
      if (savedTx && (savedTx._id || savedTx.id)) {
        setTransactions(prev => prev.map(t => t.id === tempId ? { ...t, id: savedTx._id || savedTx.id } : t));
      }
    } catch (err) {
      console.warn('Sync note (addIncome):', err.message);
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
    triggerToast(`Deleted transaction: ${tx.description}`, 'info');

    try {
      await api.deleteTransaction(id);
    } catch (err) {
      console.warn('Sync note (deleteTransaction):', err.message);
    }
  };

  // Edit Transaction
  const editTransaction = async (id, updatedData) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData, amount: parseFloat(updatedData.amount) } : t));
    triggerToast(`Updated transaction: ${updatedData.description}`);

    try {
      await api.updateTransaction(id, updatedData);
    } catch (err) {
      console.warn('Sync note (editTransaction):', err.message);
    }
  };

  // Budget CRUD
  const addBudget = async (budgetData) => {
    const tempId = Date.now().toString();
    const newB = {
      id: tempId,
      ...budgetData,
      limit: parseFloat(budgetData.limit),
      threshold: parseInt(budgetData.threshold || 80)
    };
    setBudgets(prev => [...prev, newB]);
    triggerToast(`Created budget for ${budgetData.category}`);

    try {
      const savedB = await api.createBudget(newB);
      if (savedB && (savedB._id || savedB.id)) {
        setBudgets(prev => prev.map(b => b.id === tempId ? { ...b, id: savedB._id || savedB.id } : b));
      }
    } catch (err) {
      console.warn('Sync note (addBudget):', err.message);
    }
  };

  const editBudget = async (id, updatedData) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updatedData, limit: parseFloat(updatedData.limit), threshold: parseInt(updatedData.threshold) } : b));
    triggerToast(`Updated budget configuration`);

    try {
      await api.updateBudget(id, updatedData);
    } catch (err) {
      console.warn('Sync note (editBudget):', err.message);
    }
  };

  const deleteBudget = async (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    triggerToast(`Deleted budget`, 'info');

    try {
      await api.deleteBudget(id);
    } catch (err) {
      console.warn('Sync note (deleteBudget):', err.message);
    }
  };

  // Savings Goal CRUD
  const addGoal = async (goalData) => {
    const tempId = Date.now().toString();
    const newG = {
      id: tempId,
      ...goalData,
      target: parseFloat(goalData.target),
      saved: parseFloat(goalData.saved || 0)
    };
    setGoals(prev => [...prev, newG]);
    triggerToast(`Goal "${goalData.name}" created!`);

    try {
      const savedG = await api.createGoal(newG);
      if (savedG && (savedG._id || savedG.id)) {
        setGoals(prev => prev.map(g => g.id === tempId ? { ...g, id: savedG._id || savedG.id } : g));
      }
    } catch (err) {
      console.warn('Sync note (addGoal):', err.message);
    }
  };

  const editGoal = async (id, updatedData) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updatedData, target: parseFloat(updatedData.target) } : g));
    triggerToast(`Updated savings goal details`);

    try {
      await api.updateGoal(id, updatedData);
    } catch (err) {
      console.warn('Sync note (editGoal):', err.message);
    }
  };

  const deleteGoal = async (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    triggerToast(`Deleted savings goal`, 'info');

    try {
      await api.deleteGoal(id);
    } catch (err) {
      console.warn('Sync note (deleteGoal):', err.message);
    }
  };

  const addMoneyToGoal = async (id, amount) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;
    
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const newSaved = g.saved + amt;
        triggerToast(`Added ₹${amt} to "${g.name}"`);
        
        const newTx = {
          id: Date.now().toString(),
          description: `Goal transfer: ${g.name}`,
          amount: amt,
          category: 'Savings',
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'Bank Transfer',
          notes: `Fund allocation to savings goal: ${g.name}`
        };
        setTimeout(() => {
          setTransactions(t => [newTx, ...t]);
        }, 100);
        
        addNotification('Goal Progress', `Savings goal "${g.name}" increased by ₹${amt}.`, 'success');
        return { ...g, saved: newSaved };
      }
      return g;
    }));

    try {
      await api.depositToGoal(id, amt);
    } catch (err) {
      console.warn('Sync note (addMoneyToGoal):', err.message);
    }
  };

  // Subscription CRUD
  const addSubscription = async (subData) => {
    const tempId = Date.now().toString();
    const newSub = {
      id: tempId,
      ...subData,
      cost: parseFloat(subData.cost),
      status: 'active'
    };
    setSubscriptions(prev => [...prev, newSub]);
    
    const newTx = {
      id: Date.now().toString(),
      description: `${subData.name} Subscription`,
      amount: parseFloat(subData.cost),
      category: subData.category || 'Bills',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Card',
      notes: `Subscription billing registration`
    };
    setTransactions(t => [newTx, ...t]);
    triggerToast(`Registered subscription: ${subData.name}`);

    try {
      const savedSub = await api.createSubscription(subData);
      if (savedSub && (savedSub._id || savedSub.id)) {
        setSubscriptions(prev => prev.map(s => s.id === tempId ? { ...s, id: savedSub._id || savedSub.id } : s));
      }
    } catch (err) {
      console.warn('Sync note (addSubscription):', err.message);
    }
  };

  const deleteSubscription = async (id) => {
    const sub = subscriptions.find(s => s.id === id);
    setSubscriptions(prev => prev.filter(s => s.id !== id));
    triggerToast(`Cancelled subscription registration: ${sub ? sub.name : ''}`, 'info');

    try {
      await api.deleteSubscription(id);
    } catch (err) {
      console.warn('Sync note (deleteSubscription):', err.message);
    }
  };

  // Notifications Functions
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await api.markNotificationRead(id, true);
    } catch (err) {
      console.warn('Sync note (markNotificationRead):', err.message);
    }
  };

  const markNotificationUnread = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    try {
      await api.markNotificationRead(id, false);
    } catch (err) {
      console.warn('Sync note (markNotificationUnread):', err.message);
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNotification(id);
    } catch (err) {
      console.warn('Sync note (deleteNotification):', err.message);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerToast('All notifications marked as read', 'info');
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      console.warn('Sync note (markAllNotificationsRead):', err.message);
    }
  };

  // Anomalies
  const resolveAnomaly = (id, markAsNormal) => {
    const anomaly = anomalies.find(a => a.id === id);
    if (!anomaly) return;
    
    if (markAsNormal) {
      const newTx = {
        id: Date.now().toString(),
        description: anomaly.description,
        amount: anomaly.amount,
        category: anomaly.category,
        type: 'expense',
        date: anomaly.date,
        paymentMethod: 'Card',
        notes: 'Approved anomaly transaction'
      };
      setTransactions(prev => [newTx, ...prev]);
      triggerToast('Transaction marked as normal & added to list');
    } else {
      triggerToast('Transaction flagged and dismissed');
    }
    
    setAnomalies(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    setNotifications(prev => prev.filter(n => !n.message.includes(anomaly.amount)));
  };

  return (
    <FinanceContext.Provider value={{
      darkMode, setDarkMode,
      profile, setProfile,
      user, setUser, login, signup, googleLogin, logout, updatePassword, resetPassword, sendOtp,
      transactions, addExpense, addIncome, deleteTransaction, editTransaction,
      budgets, addBudget, editBudget, deleteBudget,
      goals, addGoal, editGoal, deleteGoal, addMoneyToGoal,
      subscriptions, addSubscription, deleteSubscription,
      notifications, markNotificationRead, markNotificationUnread, deleteNotification, markAllNotificationsRead, addNotification,
      anomalies, resolveAnomaly,
      toasts, triggerToast,
      stats,
      loadBackendData
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
