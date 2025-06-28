require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Redis } = require('@upstash/redis');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 🔹 Función para generar correo aleatorio
function generarCorreo() {
  const id = Math.random().toString(36).substring(2, 10);
  return `${id}@empresaryada.com`;
}

// 🔸 Ruta: generar nuevo correo temporal
app.get('/generate', async (req, res) => {
  const email = generarCorreo();
  await redis.set(email, JSON.stringify([]), { ex: 3600 }); // 1 hora TTL
  res.json({ email });
});

// 🔸 Ruta: ver bandeja de entrada (simulada)
app.get('/inbox', async (req, res) => {
  const { email } = req.query;
  const data = await redis.get(email);

  if (!data) return res.json({ messages: [] });

  const fakeMail = {
    from: "notificaciones@empresa.com",
    subject: "¡Bienvenido a tu correo temporal!",
    date: new Date().toLocaleString(),
  };

  res.json({ messages: [fakeMail] }); // Simulación básica por ahora
});

// 🔸 Ruta: eliminar correo
app.delete('/delete', async (req, res) => {
  const { email } = req.query;
  await redis.del(email);
  res.json({ deleted: true });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
