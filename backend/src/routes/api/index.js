import { Router } from 'express';
import { register, login, profile } from '../../controllers/authController.js';
import { 
    createTransaction, 
    getTransactions, 
    getTransaction, 
    updateTransaction, 
    deleteTransaction 
} from '../../controllers/transactionController.js';
import { 
    getDashboardSummary, 
    getCategoryBreakdown, 
    getMonthlyTrends 
} from '../../controllers/dashboardController.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/health', (_req, res) => {
    res.json({ ok: true });
});

// Auth
router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, profile);

// Transactions
router.post('/transactions', requireAuth, createTransaction);
router.get('/transactions', requireAuth, getTransactions);
router.get('/transactions/:id', requireAuth, getTransaction);
router.put('/transactions/:id', requireAuth, updateTransaction);
router.delete('/transactions/:id', requireAuth, deleteTransaction);

// Dashboard
router.get('/dashboard/summary', requireAuth, getDashboardSummary);
router.get('/dashboard/categories', requireAuth, getCategoryBreakdown);
router.get('/dashboard/trends', requireAuth, getMonthlyTrends);

export default router;

