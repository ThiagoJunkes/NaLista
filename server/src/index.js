import express from "express";
import cors from "cors";
import { setupDatabase } from "./setupDatabase.js";
import listRoutes from './routes/listRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

const app = express();

app.use(cors()); // Adicione essa linha para habilitar o CORS
app.use(express.json());

app.get("/", (req, res) => res.send("NaLista API rodando"));

app.use('/lists', listRoutes);
app.use('/itens', itemRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await setupDatabase();
});
