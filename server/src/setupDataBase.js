import { pool } from './db.js';

export async function setupDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS list (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS item (
      id SERIAL PRIMARY KEY,
      list_id INTEGER REFERENCES list(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      quantity INTEGER DEFAULT 0,
      checked BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS registry (
      id SERIAL PRIMARY KEY,
      action VARCHAR(50) NOT NULL, -- 'add', 'remove', 'edit'
      item_id INTEGER REFERENCES item(id),
      old_item_name VARCHAR(255),
      new_item_name VARCHAR(255),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Tabelas verificadas/criadas com sucesso!");
}
