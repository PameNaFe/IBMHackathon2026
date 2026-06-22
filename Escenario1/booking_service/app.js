require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'booking-service', port: PORT });
});

// Rutas
app.use('/bookings', require('./src/routes/bookings'));

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.url} no encontrada` });
});

app.listen(PORT, () => {
  console.log(`🚀 booking-service corriendo en puerto ${PORT}`);
});