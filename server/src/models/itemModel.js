import { pool } from '../db.js';

export default class Item {
    constructor({ id, list_id, list, name, quantity, checked, created_at } = {}) {
        this.id = id ?? null;
        // aceitar tanto list_id quanto list (controller envia `list`)
        this.list_id = list_id ?? list ?? null;
        this.name = name ?? null;
        this.quantity = quantity ?? 1;
        this.checked = checked ?? false;
        this.created_at = created_at ?? null;
    }

    toJSON() {
        return {
            id: this.id,
            listId: this.list_id,
            name: this.name,
            quantity: this.quantity,
            checked: this.checked,
            created_at: this.created_at
        };
    }

    static _rowToItem(row) {
        if (!row) return null;
        return new Item({
            id: row.id,
            list_id: row.list_id,
            name: row.name,
            quantity: row.quantity,
            checked: row.checked,
            created_at: row.created_at
        });
    }

    async save() {
        // Inserção (usado pelo controller para criar item)
        const query = `
            INSERT INTO item (list_id, name, quantity, checked)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [this.list_id, this.name, this.quantity, this.checked];
        const { rows } = await pool.query(query, values);
        const created = Item._rowToItem(rows[0]);
        // atualizar instância corrente
        this.id = created.id;
        this.created_at = created.created_at;
        // Chama regestry para registrar a ação

        return created;
    }

    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM item WHERE id = $1', [id]);
        return Item._rowToItem(rows[0]);
    }

    static async getItens(listId) {
        const { rows } = await pool.query('SELECT * FROM item WHERE list_id = $1 ORDER BY name ASC;', [listId]);
        return rows.map(Item._rowToItem);
    }

    static async findByIdAndUpdate(id, updates = {}, options = { new: false }) {
        const allowedMap = {
            name: 'name',
            quantity: 'quantity',
            checked: 'checked',
            list: 'list_id',
            listId: 'list_id',
            list_id: 'list_id'
        };

        const setParts = [];
        const values = [];
        let idx = 1;
        for (const [key, val] of Object.entries(updates)) {
            const col = allowedMap[key];
            if (!col) continue;
            setParts.push(`${col} = $${idx}`);
            values.push(val);
            idx++;
        }

        if (setParts.length === 0) {
            // nada para atualizar; retorna o item atual
            return await Item.findById(id);
        }

        const query = `
            UPDATE item
            SET ${setParts.join(', ')}
            WHERE id = $${idx}
            RETURNING *;
        `;
        values.push(id);
        const { rows } = await pool.query(query, values);
        const updated = Item._rowToItem(rows[0]);
        return options.new ? updated : updated;
    }

    static async findByIdAndDelete(id) {
        const { rows } = await pool.query('DELETE FROM item WHERE id = $1 RETURNING *;', [id]);
        return Item._rowToItem(rows[0]);
    }
}