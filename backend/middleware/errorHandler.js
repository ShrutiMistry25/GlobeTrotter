module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'This record already exists.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({ error: 'Related record not found or in use.' });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error('[error]', err);
  return res.status(500).json({ error: 'Internal server error' });
};
