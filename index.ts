import express from 'express';
import dotenv from 'dotenv';
import measureRoutes from './routes/measureRoutes';

dotenv.config();  // Carrega as variáveis de ambiente do arquivo .env

const app = express();
app.use(express.json());  // Permite que a aplicação processe JSON

app.use('/api', measureRoutes);  // Define as rotas

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
