import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

function signToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'name, email, and password required' });
        }
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const user = await User.create({ name, email, password });
        const token = signToken(user);
        return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ message: 'Registration failed', error: err.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password required' });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await user.comparePassword(password);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
        const token = signToken(user);
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ message: 'Login failed', error: err.message });
    }
}

export async function profile(req, res) {
    const user = req.user;
    return res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}



