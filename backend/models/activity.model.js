const db = require('../config/db');

async function searchActivities({ cityId, category, maxCost, maxDuration, q }) {
  const where = [];
  const params = [];

  if (cityId) {
    where.push('a.city_id = ?');
    params.push(cityId);
  }
  if (category) {
    where.push('a.category = ?');
    params.push(category);
  }
  if (maxCost !== undefined && maxCost !== '') {
    where.push('a.est_cost <= ?');
    params.push(Number(maxCost));
  }
  if (maxDuration !== undefined && maxDuration !== '') {
    where.push('a.duration_hours <= ?');
    params.push(Number(maxDuration));
  }
  if (q) {
    where.push('(a.title LIKE ? OR a.description LIKE ? OR c.name LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const sql = `
    SELECT a.*, c.name AS city_name, c.country AS city_country
    FROM activities a
    JOIN cities c ON c.id = a.city_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY a.category, a.title`;

  const [rows] = await db.query(sql, params);
  return rows;
}

async function getActivityById(id) {
  const [rows] = await db.query(
    `SELECT a.*, c.name AS city_name, c.country AS city_country
     FROM activities a JOIN cities c ON c.id = a.city_id
     WHERE a.id = ?`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { searchActivities, getActivityById };
