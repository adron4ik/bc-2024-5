const { Command } = require('commander');
const express = require('express');

const program = new Command();
const app = express();


program
  .requiredOption('-h, --host <host>', 'адреса сервера')
  .requiredOption('-p, --port <port>', 'порт сервера')
  .requiredOption('-c, --cache <path>', 'шлях до директорії для кешу');

program.parse(process.argv);

const { host, port, cache } = program.opts();


if (!host || !port || !cache) {
  console.error('Помилка: всі параметри (--host, --port, --cache) повинні бути задані.');
  process.exit(1);
}


app.get('/', (req, res) => {
  res.send('Сервер працює');
});

app.listen(port, host, () => {
  console.log(`Сервер запущено на http://${host}:${port}`);
  console.log(`Кеш зберігається в: ${cache}`);
});
