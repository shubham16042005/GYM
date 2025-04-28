const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// LowDB Setup
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

async function initDB() {
  const dbFileExists =fs.existsSync('db.json',JSON.stringify({members:[],trainers:[]},null,2));
}
  await db.read();
  if(!db.data){
  db.data = { members: [], trainers: [] };
  await db.write();
  }
}
initDB();

// Member APIs
app.get('/api/members', async (req, res) => {
  await db.read();
  res.json(db.data.members);
});

app.post('/api/members', async (req, res) => {
  await db.read();
  const { name, age, plan } = req.body;
  const newMember = { id: nanoid(), name, age, plan };
  db.data.members.push(newMember);
  await db.write();
  res.status(201).json(newMember);
});

// Trainer APIs
app.get('/api/trainers', async (req, res) => {
  await db.read();
  res.json(db.data.trainers);
});

app.post('/api/trainers', async (req, res) => {
  await db.read();
  const { name, specialty } = req.body;
  const newTrainer = { id: nanoid(), name, specialty };
  db.data.trainers.push(newTrainer);
  await db.write();
  res.status(201).json(newTrainer);
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gym-management-2.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
