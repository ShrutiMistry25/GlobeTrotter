const db = require('../config/db');

function sanitize(row) {
  if (!row) return null;
  const { password_hash, ...rest } = row;
  return rest;
}

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash }) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );
  return findById(result.insertId);
}

async function updateUser(id, fields) {
  const allowed = ['name', 'avatar_url', 'language_pref', 'password_hash'];
  const sets = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (!sets.length) return findById(id);
  values.push(id);
  await db.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

async function deleteUser(id) {
  await db.query('DELETE FROM users WHERE id = ?', [id]);
}

async function getSavedDestinations(userId) {
  const [rows] = await db.query(
    `SELECT c.id, c.name, c.country, c.region, c.cost_index, c.popularity,
            c.image_url, sd.saved_at
     FROM saved_destinations sd
     JOIN cities c ON c.id = sd.city_id
     WHERE sd.user_id = ?
     ORDER BY sd.saved_at DESC`,
    [userId]
  );
  return rows;
}

async function addSavedDestination(userId, cityId) {
  await db.query(
    'INSERT IGNORE INTO saved_destinations (user_id, city_id) VALUES (?, ?)',
    [userId, cityId]
  );
}

async function removeSavedDestination(userId, cityId) {
  await db.query('DELETE FROM saved_destinations WHERE user_id = ? AND city_id = ?', [
    userId,
    cityId
  ]);
}

async function createResetToken(userId, tokenHash, expiresAt) {
  await db.query('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0', [userId]);
  await db.query(
    'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [userId, tokenHash, expiresAt]
  );
}

async function findValidReset(tokenHash) {
  const [rows] = await db.query(
    `SELECT * FROM password_resets
     WHERE token_hash = ? AND used = 0 AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [tokenHash]
  );
  return rows[0] || null;
}

async function markResetUsed(id) {
  await db.query('UPDATE password_resets SET used = 1 WHERE id = ?', [id]);
}

module.exports = {
  sanitize,
  findByEmail,
  findById,
  createUser,
  updateUser,
  deleteUser,
  getSavedDestinations,
  addSavedDestination,
  removeSavedDestination,
  createResetToken,
  findValidReset,
  markResetUsed
};
