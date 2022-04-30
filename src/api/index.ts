import express from 'express';

const app = express();

app.use('/main.js', (req, res) => {
    res.sendFile('../../out/main.js');
})