const db = require('../config/db');

async function searchCities({ q, region, sort }) {
  const where = [];
  const params = [];

  if (q) {
    where.push('(c.name LIKE ? OR c.country LIKE ? OR c.description LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (region) {
    where.push('c.region = ?');
    params.push(region);
  }

  const order =
    sort === 'cost' ? 'c.cost_index ASC, c.popularity DESC' : 'c.popularity DESC';

  const sql = `
    SELECT c.*,
      (SELECT COUNT(*) FROM activities a WHERE a.city_id = c.id) AS activity_count
    FROM cities c
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY ${order}`;

  const [rows] = await db.query(sql, params);
  return rows;
}

async function getCityById(id) {
  const [rows] = await db.query(
    `SELECT c.*,
       (SELECT COUNT(*) FROM activities a WHERE a.city_id = c.id) AS activity_count
     FROM cities c WHERE c.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function listRegions() {
  const [rows] = await db.query(
    'SELECT region, COUNT(*) AS city_count FROM cities GROUP BY region ORDER BY city_count DESC'
  );
  return rows;
}

async function topCities(limit = 6) {
  const [rows] = await db.query(
    `SELECT c.*,
       (SELECT COUNT(*) FROM activities a WHERE a.city_id = c.id) AS activity_count
     FROM cities c
     ORDER BY c.popularity DESC
     LIMIT ?`,
    [Number(limit) || 6]
  );
  return rows;
}

module.exports = { searchCities, getCityById, listRegions, topCities };
