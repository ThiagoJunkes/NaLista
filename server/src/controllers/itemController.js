import Item from '../models/itemModel.js';
import List from '../models/listModel.js';

export const createItem = async (req, res) => {
  const { name, quantity, listId, note } = req.body;
  if (!name || !listId) return res.status(400).json({ message: 'name e listId são obrigatórios' });
  try {
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ message: 'Lista não encontrada' });
    const item = new Item({
      name,
      quantity: quantity ?? 1,
      list: listId
    });
    const created = await item.save();
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar item' });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const item = await Item.findByIdAndUpdate(id, updates, { new: true });
    if (!item) return res.status(404).json({ message: 'Item não encontrado' });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar item' });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Item não encontrado' });
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao deletar item' });
  }
};