const express = require('express');
const redis = require('redis');

const counter = express();

const PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';

const client = redis.createClient({ url: REDIS_URL });

(async () => {
  await client.connect();
})();

counter.get('/counter/:id', async (req, res) => {
  const { id } = req.params;
  const cnt = await client.get(id);
  res.json({ views: cnt });
});

counter.post('/counter/:id/incr', async (req, res) => {
  const { id } = req.params;
  const cnt = await client.incr(id);
  res.json({ views: cnt });
});

counter.listen(PORT, () => {
  console.log(`server listen ${PORT}`);
});
