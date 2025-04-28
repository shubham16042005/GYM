const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// SQLite3 Database setup
const db = new sqlite3.Database('./gym.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');

    db.run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      plan TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS trainers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT NOT NULL
    )`);
  }
});

// Routes

// Get all members
app.get('/api/members', (req, res) => {
  db.all("SELECT * FROM members", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new member
app.post('/api/members', (req, res) => {
  const { name, age, plan } = req.body;
  db.run('INSERT INTO members (name, age, plan) VALUES (?, ?, ?)',
    [name, age, plan],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, age, plan });
    }
  );
});

// Get all trainers
app.get('/api/trainers', (req, res) => {
  db.all("SELECT * FROM trainers", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a new trainer
app.post('/api/trainers', (req, res) => {
  const { name, specialty } = req.body;
  db.run(INSERT INTO trainers (name, specialty) VALUES (?, ?),
    [name, specialty],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, name, specialty });
    }
  );
});

// Serve Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gym-management-2.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
