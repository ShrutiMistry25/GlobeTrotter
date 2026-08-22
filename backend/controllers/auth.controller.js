const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler');
const { generateResetToken, hashToken } = require('../utils/tokens');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await userModel.findByEmail(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({
    name,
    email: email.toLowerCase(),
    passwordHash
  });

  res.status(201).json({
    message: 'Account created successfully',
    token: signToken(user),
    user: userModel.sanitize(user)
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email.toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    message: 'Login successful',
    token: signToken(user),
    user: userModel.sanitize(user)
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await userModel.findByEmail(req.body.email.toLowerCase());

  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been created' });
  }

  const { raw, hash } = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await userModel.createResetToken(user.id, hash, expiresAt);

  if ((process.env.NODE_ENV || 'development') !== 'production') {
    return res.json({
      message: 'Reset token generated',
      resetToken: raw,
      note: 'DEV MODE ONLY - in production this would be emailed'
    });
  }

  res.json({ message: 'If that email exists, a reset link has been created' });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const record = await userModel.findValidReset(hashToken(token));
  if (!record) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await userModel.updateUser(record.user_id, { password_hash: passwordHash });
  await userModel.markResetUsed(record.id);

  res.json({ message: 'Password updated. You can now log in.' });
});
