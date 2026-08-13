const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rota Healthcheck
app.get('/api/health', (req, res) => {
    return res.json({
        sistema: 'ClinikOS',
        status: 'Online no Google Cloud',
        versao: '1.0.0',
        timestamp: new Date()
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ClinikOS rodando na porta ${PORT}`);
});
