const { Command } = require('commander');
const express = require('express');
const fs = require('fs');
const path = require('path');

const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <path>', 'Path to cache directory');

program.parse(process.argv);
const options = program.opts();

const app = express();

// Перевірка директорії кешу
if (!fs.existsSync(options.cache)) {
  console.error(`Error: Cache directory does not exist: ${options.cache}`);
  process.exit(1);
}

app.listen(options.port, options.host, () => {
  console.log(`Server is running at http://${options.host}:${options.port}`);
  console.log(`Cache directory: ${options.cache}`);
});
