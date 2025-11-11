import { pool } from '../db.js';

export default class List {
    constructor({ id, name, created_at } = {}) {
        this.id = id ?? null;
        this.name = name ?? null;
        this.created_at = created_at ?? null;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            created_at: this.created_at
        };
    }

    static _rowToList(row) {
        if (!row) return null;
        return new List({
            id: row.id,
            name: row.name,
            created_at: row.created_at
        });
    }

    async save() {
        const query = `
            INSERT INTO list (name)
            VALUES ($1)
            RETURNING *;
        `;
        const values = [this.name];
        const { rows } = await pool.query(query, values);
        const created = List._rowToList(rows[0]);
        this.id = created.id;
        this.created_at = created.created_at;
        return this;
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM list WHERE id = $1', [id]);
        return List._rowToList(rows[0]);
    }

    static async getAll() {
        const { rows } = await pool.query('SELECT * FROM list ORDER BY name ASC;');
        return rows.map(List._rowToList);
    }

    static async findByIdAndUpdate(id, updates = {}, options = { new: false }) {
        const allowed = { name: 'name' };
        const setParts = [];
        const values = [];
        let idx = 1;

        for (const [key, val] of Object.entries(updates)) {
            const col = allowed[key];
            if (!col) continue;
            setParts.push(`${col} = $${idx}`);
            values.push(val);
            idx++;
        }

        if (setParts.length === 0) {
            return await List.findById(id);
        }

        const query = `
            UPDATE list
            SET ${setParts.join(', ')}
            WHERE id = $${idx}
            RETURNING *;
        `;
        values.push(id);
        const { rows } = await pool.query(query, values);
        const updated = List._rowToList(rows[0]);
        return options.new ? updated : updated;
    }

    static async findByIdAndDelete(id) {
        const { rows } = await pool.query('DELETE FROM list WHERE id = $1 RETURNING *;', [id]);
        return List._rowToList(rows[0]);
    }
}