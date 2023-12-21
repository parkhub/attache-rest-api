// src/index.ts
// add body parser

import bodyParser from 'body-parser';
import express from 'express';
import router from './routes';
import basicAuth from './authorizer';

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(basicAuth);
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
