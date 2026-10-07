require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// SAMPLE USER FOR DEMONSTRATION PURPOSES
const USER = { username: 'admin', password: 'admin123' };
const SECRET =  process.env.JWT_SECRET;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
};

// -- LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === USER.username && password === USER.password) {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }

    res.status(401).json({ error: 'Invalid credentials' });
});

// -- DASHBOARD ROUTE
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}!` });
});

app.listen(5000, () => console.log('Server running on port 5000'));