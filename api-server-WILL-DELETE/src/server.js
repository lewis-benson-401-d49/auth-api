'use strict';

const express = require('express');

const notFoundHandler = require('./error-handlers/404.js.js');
const errorHandler = require('./error-handlers/500.js.js');
const logger = require('./middleware/logger.js.js');



const app = express();

app.use(express.json());

 // http://localhost:3000/api/v1/clothes

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
