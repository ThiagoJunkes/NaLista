import List from '../models/listModel.js';
import Item from '../models/itemModel.js';


export const getLists = async (req, res) => {
    try {
        const lists = await List.getAll();
        return res.json(lists);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao obter listas' });
    }
};

export const createList = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Nome é obrigatório' });
  try {
    const list = new List({ name });
    await list.save();
    return res.status(201).json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar lista' });
  }
};

export const getItens = async (req, res) => {
  const { id } = req.params;
  try {
    const list = await List.findById(id);
    if (!list) return res.status(404).json({ message: 'Lista não encontrada' });
    const items = await Item.getItens(list.id);
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao obter itens da lista' });
  }
};

export const updateList = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const list = await List.findByIdAndUpdate(id, updates, { new: true });
    if (!list) return res.status(404).json({ message: 'Lista não encontrada' });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar lista' });
  }
};

export const deleteList = async (req, res) => {
  const { id } = req.params;
  try {
    const list = await List.findByIdAndDelete(id);
    if (!list) return res.status(404).json({ message: 'Lista não encontrada' });
    // itens são removidos pelo ON DELETE CASCADE no banco
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao deletar lista' });
  }
};