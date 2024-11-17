const bodyParser = require('body-parser');
const multer = require('multer');

const cacheDir = path.resolve(options.cache);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();
const getFilePath = (name) => path.join(cacheDir, `${name}.txt`);
const noteExists = (name) => fs.existsSync(getFilePath(name));
app.get('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const filePath = getFilePath(noteName);

  if (!noteExists(noteName)) {
    return res.status(404).send('Not found');
  }

  const noteText = fs.readFileSync(filePath, 'utf-8');
  res.send(noteText);
});
app.put('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const filePath = getFilePath(noteName);

  if (!noteExists(noteName)) {
    return res.status(404).send('Not found');
  }

  fs.writeFileSync(filePath, req.body.text);
  res.send('Note updated');
});

app.delete('/notes/:name', (req, res) => {
  const noteName = req.params.name;
  const filePath = getFilePath(noteName);

  if (!noteExists(noteName)) {
    return res.status(404).send('Not found');
  }

  fs.unlinkSync(filePath);
  res.send('Note deleted');
});

app.get('/notes', (req, res) => {
  const notes = fs.readdirSync(cacheDir)
    .filter((file) => file.endsWith('.txt'))
    .map((file) => {
      const name = path.basename(file, '.txt');
      const text = fs.readFileSync(path.join(cacheDir, file), 'utf-8');
      return { name, text };
    });

  res.json(notes);
});

app.post('/write', upload.none(), (req, res) => {
  const noteName = req.body.note_name;
  const noteText = req.body.note;
  const filePath = getFilePath(noteName);

  if (noteExists(noteName)) {
    return res.status(400).send('Note already exists');
  }

  fs.writeFileSync(filePath, noteText);
  res.status(201).send('Note created');
});

app.get('/UploadForm.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'UploadForm.html'));
});
