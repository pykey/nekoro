const express = require('express');

const setup = require('./middlewares/frontendMiddleware');
const app = express();

setup(app);

const host = process.env.HOST || null;
const prettyHost = host || 'localhost';
const port = process.env.PORT || 3000;

app.listen(port, host, err => {
  if (err) {
    return console.error(err.message);
  }

  console.log(`App started at ${prettyHost}:${port}`);
});
