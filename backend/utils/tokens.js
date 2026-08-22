const crypto = require('crypto');

function generateSlug() {
  return crypto.randomBytes(6).toString('hex');
}

function generateResetToken() {
  const raw = crypto.randomBytes(24).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

function hashToken(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

module.exports = { generateSlug, generateResetToken, hashToken };
