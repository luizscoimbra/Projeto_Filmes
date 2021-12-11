const express = require('express');

const cors = require('cors')

const app = express();

app.use(cors());

app.use(express.json());

const filmeRouter = require('./routes/filme.router');

app.use('/filme', filmeRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`App Rodando na porta ${port}`);
})
