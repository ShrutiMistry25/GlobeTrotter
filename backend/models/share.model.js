const db = require('../config/db');

async function findPublicBySlug(slug) {
  const [trips] = await db.query(
    `SELECT t.*, u.name AS owner_name, u.avatar_url AS owner_avatar
     FROM trips t JOIN users u ON u.id = t.user_id
     WHERE t.share_slug = ? AND t.is_public = 1`,
    [slug]
  );
  if (!trips.length) return null;

  const trip = trips[0];
  const [stops] = await db.query(
    `SELECT ts.*, c.name AS city_name, c.country AS city_country, c.image_url AS city_image
     FROM trip_stops ts JOIN cities c ON c.id = ts.city_id
     WHERE ts.trip_id = ? ORDER BY ts.position, ts.arrival_date`,
    [trip.id]
  );
  const [activities] = await db.query(
    `SELECT sa.* FROM stop_activities sa
     JOIN trip_stops ts ON ts.id = sa.stop_id
     WHERE ts.trip_id = ? ORDER BY sa.scheduled_date, sa.start_time, sa.position`,
    [trip.id]
  );
  const byStop = {};
  for (const a of activities) {
    (byStop[a.stop_id] ||= []).push(a);
  }
  return {
    ...trip,
    stops: stops.map((s) => ({ ...s, activities: byStop[s.id] || [] }))
  };
}

async function copyTrip(sourceTripId, userId) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[trip]] = await conn.query('SELECT * FROM trips WHERE id = ?', [sourceTripId]);
    if (!trip) throw Object.assign(new Error('Trip not found'), { status: 404 });

    const [result] = await conn.query(
      `INSERT INTO trips (user_id, name, description, cover_image_url, start_date, end_date, status, budget_total)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', ?)`,
      [
        userId,
        `Copy of ${trip.name}`,
        trip.description,
        trip.cover_image_url,
        trip.start_date,
        trip.end_date,
        trip.budget_total
      ]
    );
    const newTripId = result.insertId;

    const [stops] = await conn.query(
      'SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY position',
      [sourceTripId]
    );

    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      const [stopRes] = await conn.query(
        `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, position, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [newTripId, s.city_id, s.arrival_date, s.departure_date, i, s.notes]
      );
      const newStopId = stopRes.insertId;

      const [acts] = await conn.query(
        'SELECT * FROM stop_activities WHERE stop_id = ? ORDER BY position',
        [s.id]
      );
      for (let j = 0; j < acts.length; j++) {
        const a = acts[j];
        await conn.query(
          `INSERT INTO stop_activities
             (stop_id, activity_id, title, scheduled_date, start_time, duration_hours, est_cost, category, notes, position)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newStopId,
            a.activity_id,
            a.title,
            a.scheduled_date,
            a.start_time,
            a.duration_hours,
            a.est_cost,
            a.category,
            a.notes,
            j
          ]
        );
      }
    }

    const [expenses] = await conn.query('SELECT * FROM expenses WHERE trip_id = ?', [
      sourceTripId
    ]);
    for (const e of expenses) {
      await conn.query(
        'INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES (?, ?, ?, ?, ?)',
        [newTripId, e.category, e.title, e.amount, e.expense_date]
      );
    }

    await conn.commit();
    return newTripId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

module.exports = { findPublicBySlug, copyTrip };
