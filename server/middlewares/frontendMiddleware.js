const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

module.exports = (app, options = {}) => {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'dist');

  app.use(compression());
  app.use(helmet());
  app.use(publicPath, express.static(outputPath));

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
};
