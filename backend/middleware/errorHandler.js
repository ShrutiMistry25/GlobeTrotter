module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed' || (err.status === 400 && err instanceof SyntaxError)) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'This record already exists.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({ error: 'Related record not found or in use.' });
  }
  if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || err.errno === 3819 || err.sqlState === '45000' || err.sqlState === '3819') {
    return res.status(400).json({ error: err.message.replace(/^Check constraint '.*?' is violated\.$/, 'Invalid data: date range or field value is not allowed.') });
  }
  if (err.code === 'ER_DATA_TOO_LONG' || err.code === 'ER_TRUNCATED_WRONG_VALUE' || err.code === 'WARN_DATA_TRUNCATED') {
    return res.status(400).json({ error: 'One of the provided values has an invalid format or length.' });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error('[error]', err);
  return res.status(500).json({ error: 'Internal server error' });
};
