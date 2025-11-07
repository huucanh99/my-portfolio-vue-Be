// src/controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ errCode: 1, message: 'Missing email or password' });
    }
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ errCode: 2, message: 'Email already exists' });
    }
    const user = await User.create({ email, password, name });
    const token = signToken(user);
    return res.status(201).json({ errCode: 0, message: 'Ok', user, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errCode: -1, message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ errCode: 1, message: 'Missing email or password' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ errCode: 3, message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ errCode: 3, message: 'Invalid credentials' });

    const token = signToken(user);
    return res.status(200).json({ errCode: 0, message: 'Ok', user, token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errCode: -1, message: 'Server error' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    return res.status(200).json({ errCode: 0, user });
  } catch (e) {
    return res.status(500).json({ errCode: -1, message: 'Server error' });
  }
};

// (Tùy chọn) Admin list users
export const listUsers = async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.json({ errCode: 0, users });
};

// (Tùy chọn) Update profile
export const updateMe = async (req, res) => {
  const { name, avatar } = req.body || {};
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { name, avatar } },
    { new: true }
  );
  return res.json({ errCode: 0, user });
};
