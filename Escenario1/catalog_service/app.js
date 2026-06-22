require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'catalog-service', port: 3001 });
});

// Rutas
app.use('/auth', require('./src/routes/auth'));
app.use('/spaces', require('./src/routes/spaces'));

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` });
});

app.listen(PORT, () => {
  console.log(`🚀 catalog-service corriendo en puerto ${PORT}`);
});