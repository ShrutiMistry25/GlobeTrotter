const fs = require('fs');
const path = require('path');

const rootEnv = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnv)) {
  require('dotenv').config({ path: rootEnv });
} else {
  require('dotenv').config();
}

const app = require('./app');

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Copy ../.env.example to backend/.env and configure it.');
  process.exit(1);
}

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`GlobeTrotter API listening on http://localhost:${PORT}`);
});
