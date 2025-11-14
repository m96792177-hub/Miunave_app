const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database(path.join(__dirname, 'database.db'));

const email = 'demo@miunave.app';
const nombre = 'Demo';
const password = 'demo123';

const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
if (exists) {
  console.log('Usuario demo ya existe');
  process.exit(0);
}

(async () => {
  const hash = await bcrypt.hash(password, 10);
  const info = db.prepare('INSERT INTO users (nombre,email,password,role) VALUES (?,?,?,?)')
    .run(nombre, email, hash, 'admin');
  console.log('Usuario demo creado:', { id: info.lastInsertRowid, email, password });
})();
