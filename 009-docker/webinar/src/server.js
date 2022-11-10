const express = require('express');
const redis = require('redis');

const app = express();

const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

app.get('/:name', async (req, res) => {
  const { name } = req.params;

  const cnt = await client.incr(name);

  res.json({ message: `Привет, ${name} из контейнера!`, cnt });
});

app.listen(PORT, () => {
  console.log(`Сервер слушает на порту ${PORT}`);
});
