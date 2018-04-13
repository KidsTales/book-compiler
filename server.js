const express = require('express');
const app = express();

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './pictures/')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')[1];
    if (req.query.studentName)
      cb(null, req.query.studentName.replace(/ /g, '_') + '.' + ext);
    
    if (req.query.fileName)
      cb(null, req.query.fileName);
  }
})
var upload = multer({ dest: 'pictures/', storage })


const bodyParser = require('body-parser');

const bookCompiler = require('./bookCompiler.js');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/generate', (req, res, next) => {

  //return res.end(JSON.stringify(req.body));
  bookCompiler.compile(req.body.book, req.body.workshop, req.body.students);

  res.status(200);
  return res.json({ path: 'docs/' + req.body.book.title + '.docx' });
});

app.post('/picture', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.json({ success: true });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));