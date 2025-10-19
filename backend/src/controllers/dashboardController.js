import { Transaction } from '../models/index.js';
import { Op } from 'sequelize';

export async function getDashboardSummary(req, res) {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        const whereClause = { userId };
        
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = startDate;
            if (endDate) whereClause.date[Op.lte] = endDate;
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            attributes: ['type', 'amount']
        });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const netBalance = totalIncome - totalExpenses;

        return res.json({
            totalIncome,
            totalExpenses,
            netBalance,
            transactionCount: transactions.length
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch dashboard summary', error: err.message });
    }
}

export async function getCategoryBreakdown(req, res) {
    try {
        const userId = req.user.id;
        const { startDate, endDate, type = 'expense' } = req.query;

        const whereClause = { userId, type };
        
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = startDate;
            if (endDate) whereClause.date[Op.lte] = endDate;
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            attributes: ['category', 'amount']
        });

        const categoryTotals = {};
        transactions.forEach(transaction => {
            const category = transaction.category;
            const amount = parseFloat(transaction.amount);
            categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        });

        const breakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount,
            percentage: 0 // Will be calculated on frontend
        }));

        return res.json(breakdown);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch category breakdown', error: err.message });
    }
}

export async function getMonthlyTrends(req, res) {
    try {
        const userId = req.user.id;
        const { months = 12 } = req.query;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(months));
        startDate.setDate(1); // First day of the month

        const transactions = await Transaction.findAll({
            where: {
                userId,
                date: { [Op.gte]: startDate }
            },
            attributes: ['type', 'amount', 'date']
        });

        const monthlyData = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0 };
            }
            
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'income') {
                monthlyData[monthKey].income += amount;
            } else {
                monthlyData[monthKey].expense += amount;
            }
        });

        const trends = Object.entries(monthlyData)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, data]) => ({
                month,
                income: data.income,
                expense: data.expense,
                net: data.income - data.expense
            }));

        return res.json(trends);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch monthly trends', error: err.message });
    }
}

