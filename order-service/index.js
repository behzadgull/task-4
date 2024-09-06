const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'order_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.post('/orders', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    db.query('INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity], (err, results) => {
        if (err) return res.status(500).send('Error creating order');
        res.status(201).send(`Order created with ID: ${results.insertId}`);
    });
});

app.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM orders WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Error fetching order');
        if (results.length === 0) return res.status(404).send('Order not found');
        res.status(200).json(results[0]);
    });
});

app.listen(3003, () => console.log('Order service running on port 3003'));
