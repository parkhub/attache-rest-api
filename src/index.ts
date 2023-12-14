// src/index.ts
// add body parser

import bodyParser from 'body-parser';
import express from 'express';
import router from './routes';
import basicAuth from './authorizer';

const app = express();
const port = 3000; // default port to listen

app.use(bodyParser.json());
app.use(basicAuth);
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
