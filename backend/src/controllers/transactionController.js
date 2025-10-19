import { Transaction, User } from '../models/index.js';
import { Op } from 'sequelize';

export async function createTransaction(req, res) {
    try {
        const { type, category, amount, note, date, recurring } = req.body;
        const userId = req.user.id;

        if (!type || !category || !amount || !date) {
            return res.status(400).json({ message: 'type, category, amount, and date are required' });
        }

        if (!['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'type must be income or expense' });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'amount must be positive' });
        }

        const transaction = await Transaction.create({
            userId,
            type,
            category,
            amount,
            note,
            date,
            recurring: recurring || 'none'
        });

        return res.status(201).json(transaction);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to create transaction', error: err.message });
    }
}

export async function getTransactions(req, res) {
    try {
        const userId = req.user.id;
        const { 
            page = 1, 
            limit = 10, 
            type, 
            category, 
            startDate, 
            endDate,
            search 
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { userId };

        // Add filters
        if (type) whereClause.type = type;
        if (category) whereClause.category = category;
        
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date[Op.gte] = startDate;
            if (endDate) whereClause.date[Op.lte] = endDate;
        }

        if (search) {
            whereClause[Op.or] = [
                { category: { [Op.like]: `%${search}%` } },
                { note: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: whereClause,
            order: [['date', 'DESC'], ['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        return res.json({
            transactions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
    }
}

export async function getTransaction(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const transaction = await Transaction.findOne({
            where: { id, userId },
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        return res.json(transaction);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch transaction', error: err.message });
    }
}

export async function updateTransaction(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { type, category, amount, note, date, recurring } = req.body;

        const transaction = await Transaction.findOne({
            where: { id, userId }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        if (type && !['income', 'expense'].includes(type)) {
            return res.status(400).json({ message: 'type must be income or expense' });
        }

        if (amount && amount <= 0) {
            return res.status(400).json({ message: 'amount must be positive' });
        }

        await transaction.update({
            ...(type && { type }),
            ...(category && { category }),
            ...(amount && { amount }),
            ...(note !== undefined && { note }),
            ...(date && { date }),
            ...(recurring !== undefined && { recurring })
        });

        return res.json(transaction);
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update transaction', error: err.message });
    }
}

export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const transaction = await Transaction.findOne({
            where: { id, userId }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await transaction.destroy();
        return res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to delete transaction', error: err.message });
    }
}

