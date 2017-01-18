/** @module middleware/frontend */

const express = require('express');
const path = require('path');

/**
 * Frontend middleware
 *
 * @param {express} app Express app instance
 * @param {Object} options Options to load the frontend
 * @returns {express} Express app instance
 */
module.exports = (app, options = {}) => {
  /**
   * Base path where the application runs
   *
   * @type {string}
   * @default /
   */
  const publicPath = options.publicPath || '/';

  /**
   * Path where are the static files
   *
   * @type {string}
   */
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'dist');

  app.use(publicPath, express.static(outputPath));

  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));

  return app;
};
