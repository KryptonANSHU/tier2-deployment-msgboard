const express = require('express');
const { initDb, getMessages, addMessage } = require('./db');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/messages', async (req, res) => {
  try {
    res.json(await getMessages());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  const text = (req.body.message || '').trim();
  if (!text) return res.status(400).json({ error: 'message is required' });
  try {
    res.status(201).json(await addMessage(text));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

initDb()
  .then(() => app.listen(PORT, () => console.log(`msgboard listening on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
