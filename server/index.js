import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'fastx';
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'stk7890';

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Connected to MongoDB database: ${DB_NAME}`);

  // Ensure default key exists
  const keysCollection = db.collection('keys');
  const count = await keysCollection.countDocuments();
  if (count === 0) {
    await keysCollection.insertOne({
      id: '1',
      name: 'Default',
      key: 'test7890',
      createdAt: new Date().toLocaleDateString('en-GB'),
      uses: 0,
      enabled: true,
    });
  }
}

// --- Auth ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { key } = req.body;
    const found = await db.collection('keys').findOne({ key, enabled: true });
    if (found) {
      res.json({ success: true, key: found });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/admin', async (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// --- Keys ---
app.get('/api/keys', async (_req, res) => {
  try {
    const keys = await db.collection('keys').find().toArray();
    res.json(keys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/keys', async (req, res) => {
  try {
    const { name, key, id, createdAt } = req.body;
    const newKey = {
      id: id || Date.now().toString(),
      name,
      key: key || generateKey(),
      createdAt: createdAt || new Date().toLocaleDateString('en-GB'),
      uses: 0,
      enabled: true,
    };
    await db.collection('keys').insertOne(newKey);
    res.json(newKey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/keys/:id', async (req, res) => {
  try {
    await db.collection('keys').deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/keys/:id/toggle', async (req, res) => {
  try {
    const key = await db.collection('keys').findOne({ id: req.params.id });
    if (!key) return res.status(404).json({ error: 'Key not found' });
    await db.collection('keys').updateOne(
      { id: req.params.id },
      { $set: { enabled: !key.enabled } }
    );
    res.json({ success: true, enabled: !key.enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/keys/:id/increment', async (req, res) => {
  try {
    await db.collection('keys').updateOne(
      { id: req.params.id },
      { $inc: { uses: 1 } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Logs ---
app.get('/api/logs', async (_req, res) => {
  try {
    const logs = await db.collection('logs')
      .find()
      .sort({ timestamp: -1 })
      .limit(500)
      .toArray();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { keyName, endpoint, query, status } = req.body;
    const newLog = {
      id: Date.now().toString(),
      keyName,
      endpoint,
      query,
      status,
      timestamp: new Date().toISOString(),
    };
    await db.collection('logs').insertOne(newLog);
    res.json(newLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'fx_';
  for (let i = 0; i < 24; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`FastX API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

export default app;
