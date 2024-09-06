const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.post('/users', (req, res) => {
    const { username, email } = req.body;
    db.query('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], (err, results) => {
        if (err) return res.status(500).send('Error creating user');
        res.status(201).send(`User created with ID: ${results.insertId}`);
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Error fetching user');
        if (results.length === 0) return res.status(404).send('User not found');
        res.status(200).json(results[0]);
    });
});

app.listen(3001, () => console.log('User service running on port 3001'));
