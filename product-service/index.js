const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL', err);
        return;
    }
    console.log('Connected to MySQL');
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price], (err, results) => {
        if (err) return res.status(500).send('Error creating product');
        res.status(201).send(`Product created with ID: ${results.insertId}`);
    });
});

app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Error fetching product');
        if (results.length === 0) return res.status(404).send('Product not found');
        res.status(200).json(results[0]);
    });
});

app.listen(3002, () => console.log('Product service running on port 3002'));
