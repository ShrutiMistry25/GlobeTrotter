const db = require('../config/db');

const num = (v) => (v === null || v === undefined ? 0 : Number(v));

async function listTripsByUser(userId) {
  const [rows] = await db.query(
    `SELECT t.*,
       (SELECT COUNT(*) FROM trip_stops s WHERE s.trip_id = t.id) AS stop_count,
       (SELECT COUNT(DISTINCT s.city_id) FROM trip_stops s WHERE s.trip_id = t.id) AS destination_count,
       (SELECT COUNT(*) FROM stop_activities sa JOIN trip_stops s2 ON sa.stop_id = s2.id WHERE s2.trip_id = t.id) AS activity_count,
       (
         (SELECT COALESCE(SUM(e.amount), 0) FROM expenses e WHERE e.trip_id = t.id) +
         (SELECT COALESCE(SUM(sa.est_cost), 0)
            FROM stop_activities sa JOIN trip_stops s3 ON sa.stop_id = s3.id
           WHERE s3.trip_id = t.id)
       ) AS total_spent
     FROM trips t
     WHERE t.user_id = ?
     ORDER BY t.start_date DESC`,
    [userId]
  );
  return rows.map((r) => ({
    ...r,
    budget_total: r.budget_total === null ? null : num(r.budget_total),
    total_spent: num(r.total_spent)
  }));
}

async function getTripBase(id) {
  const [rows] = await db.query('SELECT * FROM trips WHERE id = ?', [id]);
  return rows[0] || null;
}

async function createTrip({ user_id, name, description, cover_image_url, start_date, end_date, status, budget_total }) {
  const [result] = await db.query(
    `INSERT INTO trips (user_id, name, description, cover_image_url, start_date, end_date, status, budget_total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      name,
      description || null,
      cover_image_url || null,
      start_date,
      end_date,
      status || 'draft',
      budget_total === '' || budget_total === undefined ? null : budget_total
    ]
  );
  return getTripBase(result.insertId);
}

async function updateTrip(id, fields) {
  const allowed = ['name', 'description', 'cover_image_url', 'start_date', 'end_date', 'status', 'budget_total'];
  const sets = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(key === 'budget_total' && fields[key] === '' ? null : fields[key]);
    }
  }
  if (!sets.length) return getTripBase(id);
  values.push(id);
  await db.query(`UPDATE trips SET ${sets.join(', ')} WHERE id = ?`, values);
  return getTripBase(id);
}

async function deleteTrip(id) {
  await db.query('DELETE FROM trips WHERE id = ?', [id]);
}

async function getStops(tripId) {
  const [rows] = await db.query(
    `SELECT ts.*, c.name AS city_name, c.country AS city_country,
            c.image_url AS city_image, c.cost_index AS city_cost_index
     FROM trip_stops ts
     JOIN cities c ON c.id = ts.city_id
     WHERE ts.trip_id = ?
     ORDER BY ts.position, ts.arrival_date`,
    [tripId]
  );
  return rows;
}

async function getActivities(tripId) {
  const [rows] = await db.query(
    `SELECT sa.*
     FROM stop_activities sa
     JOIN trip_stops ts ON ts.id = sa.stop_id
     WHERE ts.trip_id = ?
     ORDER BY sa.scheduled_date, sa.start_time, sa.position`,
    [tripId]
  );
  return rows;
}

async function getExpenses(tripId) {
  const [rows] = await db.query(
    `SELECT * FROM expenses WHERE trip_id = ? ORDER BY expense_date, id`,
    [tripId]
  );
  return rows.map((r) => ({ ...r, amount: num(r.amount) }));
}

async function getTripDetail(tripId) {
  const trip = await getTripBase(tripId);
  if (!trip) return null;

  const [stops, activities, expenses] = await Promise.all([
    getStops(tripId),
    getActivities(tripId),
    getExpenses(tripId)
  ]);

  const byStop = {};
  for (const a of activities) {
    (byStop[a.stop_id] ||= []).push({
      ...a,
      est_cost: num(a.est_cost),
      duration_hours: num(a.duration_hours)
    });
  }

  return {
    trip: { ...trip, budget_total: trip.budget_total === null ? null : num(trip.budget_total) },
    stops: stops.map((s) => ({ ...s, activities: byStop[s.id] || [] })),
    activities_flat: activities.map((a) => ({
      ...a,
      est_cost: num(a.est_cost),
      duration_hours: num(a.duration_hours)
    })),
    expenses
  };
}

async function addStop(tripId, { city_id, arrival_date, departure_date, notes }) {
  const [[{ maxPos }]] = await db.query(
    'SELECT COALESCE(MAX(position), -1) + 1 AS maxPos FROM trip_stops WHERE trip_id = ?',
    [tripId]
  );
  const [result] = await db.query(
    `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, position, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tripId, city_id, arrival_date, departure_date, maxPos, notes || null]
  );
  return result.insertId;
}

async function getStopById(stopId) {
  const [rows] = await db.query(
    `SELECT ts.*, c.name AS city_name, c.country AS city_country, c.image_url AS city_image
     FROM trip_stops ts
     JOIN cities c ON c.id = ts.city_id
     WHERE ts.id = ?`,
    [stopId]
  );
  return rows[0] || null;
}

async function updateStop(stopId, fields) {
  const allowed = ['arrival_date', 'departure_date', 'notes'];
  const sets = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (sets.length) {
    values.push(stopId);
    await db.query(`UPDATE trip_stops SET ${sets.join(', ')} WHERE id = ?`, values);
  }
  return getStopById(stopId);
}

async function deleteStop(stopId) {
  const stop = await getStopById(stopId);
  await db.query('DELETE FROM trip_stops WHERE id = ?', [stopId]);
  if (stop) {
    await db.query(
      'UPDATE trip_stops SET position = position - 1 WHERE trip_id = ? AND position > ?',
      [stop.trip_id, stop.position]
    );
  }
}

async function reorderStops(tripId, orderedIds) {
  const [[{ n }]] = await db.query(
    `SELECT COUNT(*) AS n FROM trip_stops WHERE trip_id = ? AND id IN (${orderedIds.map(() => '?').join(',')})`,
    [tripId, ...orderedIds]
  );
  if (Number(n) !== orderedIds.length) {
    const err = new Error('One or more stops do not belong to this trip');
    err.status = 400;
    throw err;
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (let i = 0; i < orderedIds.length; i++) {
      await conn.query('UPDATE trip_stops SET position = ? WHERE id = ?', [i, orderedIds[i]]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function addStopActivity(stopId, fields) {
  let { activity_id, title, category, est_cost, duration_hours } = fields;
  const { scheduled_date, start_time, notes } = fields;

  if (activity_id) {
    const [cats] = await db.query('SELECT * FROM activities WHERE id = ?', [activity_id]);
    if (!cats.length) {
      const err = new Error('Activity not found in catalog');
      err.status = 404;
      throw err;
    }
    const cat = cats[0];
    title = title !== undefined && title !== '' ? title : cat.title;
    category = category !== undefined && category !== '' ? category : cat.category;
    est_cost = est_cost !== undefined && est_cost !== '' ? est_cost : cat.est_cost;
    duration_hours = duration_hours !== undefined && duration_hours !== '' ? duration_hours : cat.duration_hours;
  }

  const [[{ maxPos }]] = await db.query(
    'SELECT COALESCE(MAX(position), -1) + 1 AS maxPos FROM stop_activities WHERE stop_id = ?',
    [stopId]
  );

  const [result] = await db.query(
    `INSERT INTO stop_activities
       (stop_id, activity_id, title, scheduled_date, start_time, duration_hours, est_cost, category, notes, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      stopId,
      activity_id || null,
      title,
      scheduled_date,
      start_time || null,
      duration_hours === undefined || duration_hours === '' ? 2.0 : duration_hours,
      est_cost === undefined || est_cost === '' ? 0 : est_cost,
      category || 'outdoors',
      notes || null,
      maxPos
    ]
  );
  return result.insertId;
}

async function getActivityById(saId) {
  const [rows] = await db.query('SELECT * FROM stop_activities WHERE id = ?', [saId]);
  return rows[0] || null;
}

async function updateStopActivity(saId, fields) {
  const allowed = ['title', 'scheduled_date', 'start_time', 'duration_hours', 'est_cost', 'category', 'notes'];
  const sets = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (sets.length) {
    values.push(saId);
    await db.query(`UPDATE stop_activities SET ${sets.join(', ')} WHERE id = ?`, values);
  }
  return getActivityById(saId);
}

async function deleteStopActivity(saId) {
  const act = await getActivityById(saId);
  await db.query('DELETE FROM stop_activities WHERE id = ?', [saId]);
  if (act) {
    await db.query(
      'UPDATE stop_activities SET position = position - 1 WHERE stop_id = ? AND position > ?',
      [act.stop_id, act.position]
    );
  }
}

async function reorderStopActivities(stopId, orderedIds) {
  const [[{ n }]] = await db.query(
    `SELECT COUNT(*) AS n FROM stop_activities WHERE stop_id = ? AND id IN (${orderedIds.map(() => '?').join(',')})`,
    [stopId, ...orderedIds]
  );
  if (Number(n) !== orderedIds.length) {
    const err = new Error('One or more activities do not belong to this stop');
    err.status = 400;
    throw err;
  }
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (let i = 0; i < orderedIds.length; i++) {
      await conn.query('UPDATE stop_activities SET position = ? WHERE id = ?', [i, orderedIds[i]]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function getExpenseById(expenseId) {
  const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);
  return rows[0] ? { ...rows[0], amount: num(rows[0].amount) } : null;
}

async function addExpense(tripId, { category, title, amount, expense_date }) {
  const [result] = await db.query(
    'INSERT INTO expenses (trip_id, category, title, amount, expense_date) VALUES (?, ?, ?, ?, ?)',
    [tripId, category || 'other', title, amount, expense_date || null]
  );
  const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [result.insertId]);
  return { ...rows[0], amount: num(rows[0].amount) };
}

async function updateExpense(expenseId, fields) {
  const allowed = ['category', 'title', 'amount', 'expense_date'];
  const sets = [];
  const values = [];
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (sets.length) {
    values.push(expenseId);
    await db.query(`UPDATE expenses SET ${sets.join(', ')} WHERE id = ?`, values);
  }
  const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [expenseId]);
  return rows[0] ? { ...rows[0], amount: num(rows[0].amount) } : null;
}

async function deleteExpense(expenseId) {
  await db.query('DELETE FROM expenses WHERE id = ?', [expenseId]);
}

async function enableShare(tripId, slug) {
  await db.query('UPDATE trips SET share_slug = ?, is_public = 1 WHERE id = ?', [slug, tripId]);
  return slug;
}

async function disableShare(tripId) {
  await db.query('UPDATE trips SET is_public = 0 WHERE id = ?', [tripId]);
}

function buildBudget(trip, stops, activities, expenses) {
  const expenseTotal = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const activityTotal = activities.reduce((sum, a) => sum + Number(a.est_cost), 0);
  const totalSpent = expenseTotal + activityTotal;

  const byCategoryMap = {};
  for (const e of expenses) {
    byCategoryMap[e.category] = (byCategoryMap[e.category] || 0) + Number(e.amount);
  }
  byCategoryMap.activities = (byCategoryMap.activities || 0) + activityTotal;
  const byCategory = Object.entries(byCategoryMap).map(([category, amount]) => ({
    category,
    amount: Math.round(amount * 100) / 100
  }));

  const start = new Date(`${trip.start_date}T00:00:00Z`);
  const end = new Date(`${trip.end_date}T00:00:00Z`);
  const dayCount = Math.max(1, Math.round((end - start) / 86400000) + 1);

  const dailyMap = {};
  for (const e of expenses) {
    if (e.expense_date) dailyMap[e.expense_date] = (dailyMap[e.expense_date] || 0) + Number(e.amount);
  }
  for (const a of activities) {
    dailyMap[a.scheduled_date] = (dailyMap[a.scheduled_date] || 0) + Number(a.est_cost);
  }

  const perDay = [];
  const overBudgetDays = [];
  const allowance = trip.budget_total ? Number(trip.budget_total) / dayCount : null;

  for (let i = 0; i < dayCount; i++) {
    const d = new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10);
    const amount = Math.round((dailyMap[d] || 0) * 100) / 100;
    const over = allowance !== null && amount > allowance;
    if (over) overBudgetDays.push(d);
    perDay.push({ date: d, amount, over });
  }

  const budgetTotal = trip.budget_total === null ? null : Number(trip.budget_total);
  return {
    budget_total: budgetTotal,
    total_spent: Math.round(totalSpent * 100) / 100,
    remaining: budgetTotal === null ? null : Math.round((budgetTotal - totalSpent) * 100) / 100,
    percent_used: budgetTotal ? Math.round((totalSpent / budgetTotal) * 100) : null,
    trip_days: dayCount,
    daily_average: Math.round((totalSpent / dayCount) * 100) / 100,
    daily_allowance: allowance !== null ? Math.round(allowance * 100) / 100 : null,
    over_budget_days: overBudgetDays,
    by_category: byCategory.sort((a, b) => b.amount - a.amount),
    per_day: perDay
  };
}

module.exports = {
  listTripsByUser,
  getTripBase,
  getTripDetail,
  createTrip,
  updateTrip,
  deleteTrip,
  getStops,
  getActivities,
  getExpenses,
  addStop,
  getStopById,
  updateStop,
  deleteStop,
  reorderStops,
  addStopActivity,
  getActivityById,
  updateStopActivity,
  deleteStopActivity,
  reorderStopActivities,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  enableShare,
  disableShare,
  buildBudget
};
