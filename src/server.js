'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);


// Routes
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
// app.use(authRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
