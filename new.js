//PART1


// Імпорт модулів Commander.js та Express.js
const { Command } = require('commander');
const express = require('express');

// Ініціалізація об'єкта командного рядка (Commander) та Express-додатку
const program = new Command();
const app = express();

// Налаштування обов'язкових параметрів командного рядка
program
  .requiredOption('-h, --host <host>', 'адреса сервера')  // Параметр для визначення адреси сервера
  .requiredOption('-p, --port <port>', 'порт сервера')    // Параметр для визначення порту сервера
  .requiredOption('-c, --cache <path>', 'шлях до директорії для кешу');  // Параметр для визначення шляху до кешу

// Розбір аргументів командного рядка
program.parse(process.argv);

// Отримання значень параметрів з командного рядка
const { host, port, cache } = program.opts();

// Перевірка наявності обов'язкових параметрів, якщо не задані — вивести помилку та завершити виконання
if (!host || !port || !cache) {
  console.error('Помилка: всі параметри (--host, --port, --cache) повинні бути задані.');
  process.exit(1);
}

// Визначення маршруту для кореневої сторінки сервера
app.get('/', (req, res) => {
  res.send('Сервер працює');  // Відповідь сервера на GET-запит до кореневої URL-адреси
});

// Запуск веб-сервера з параметрами host і port, переданими через командний рядок
app.listen(port, host, () => {
  console.log(`Сервер запущено на http://${host}:${port}`);  // Повідомлення про успішний запуск
  console.log(`Кеш зберігається в: ${cache}`);  // Повідомлення про шлях до кешу
});





//part 2