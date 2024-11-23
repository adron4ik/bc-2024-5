const { program } = require('commander');
const express = require('express');
const fs = require('fs');
const path = require('path');

program
  .requiredOption('-h, --host <host>', 'Адреса сервера')
  .requiredOption('-p, --port <port>', 'Порт сервера')
  .requiredOption('-c, --cache <path>', 'Шлях до директорії для кешу');

program.parse(process.argv);
const options = program.opts();

const app = express();
const cacheDir = path.resolve(options.cache);


if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/write', (req, res) => {
  const { note_name, note } = req.body;
  if (!note_name || !note) {
    return res.status(400).send('Необхідно вказати ім’я нотатки та текст');
  }

  const notePath = path.join(cacheDir, `${note_name}.txt`);

  if (fs.existsSync(notePath)) {
    return res.status(400).send('Нотатка з таким ім’ям вже існує');
  }

  fs.writeFileSync(notePath, note, 'utf8');
  res.status(201).send('Нотатка створена');
});


app.get('/notes/:noteName', (req, res) => {
  const notePath = path.join(cacheDir, `${req.params.noteName}.txt`);

  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Нотатка не знайдена');
  }

  const note = fs.readFileSync(notePath, 'utf8');
  res.send(note);
});


app.get('/notes', (req, res) => {
  const files = fs.readdirSync(cacheDir);
  const notes = files.map(file => {
    const name = path.basename(file, '.txt');
    const text = fs.readFileSync(path.join(cacheDir, file), 'utf8');
    return { name, text };
  });

  res.status(200).json(notes);
});


app.put('/notes/:noteName', (req, res) => {
  const notePath = path.join(cacheDir, `${req.params.noteName}.txt`);

  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Нотатка не знайдена');
  }

  fs.writeFileSync(notePath, req.body.note || '', 'utf8');
  res.send('Нотатка оновлена');
});


app.delete('/notes/:noteName', (req, res) => {
  const notePath = path.join(cacheDir, `${req.params.noteName}.txt`);

  if (!fs.existsSync(notePath)) {
    return res.status(404).send('Нотатка не знайдена');
  }

  fs.unlinkSync(notePath);
  res.send('Нотатка видалена');
});


app.get('/UploadForm.html', (req, res) => {
  const formPath = path.join(__dirname, 'UploadForm.html');

  if (!fs.existsSync(formPath)) {
    return res.status(404).send('HTML форма не знайдена');
  }

  res.sendFile(formPath);
});


app.listen(options.port, options.host, () => {
  console.log(`Сервер працює на http://${options.host}:${options.port}`);
});
