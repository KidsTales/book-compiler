const express = require('express');
const app = express();

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './pictures/')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')[1];
    cb(null, req.query.studentName + '.' + ext);
  }
})
var upload = multer({ dest: 'pictures/', storage })


const bodyParser = require('body-parser');

const bookCompiler = require('./bookCompiler.js');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/generate', (req, res, next) => {
  console.log(req.body);
  //return res.end(JSON.stringify(req.body));
  bookCompiler.compile(req.body.book.title, req.body.book.subtitle, req.body.workshop.location, req.body.book.introduction, req.body.students)
  
  res.status(200);
  return res.json({ path: 'docs/' + req.body.workshop.location.name + '.docx' });
});

app.post('/picture', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.listen(3000, () => console.log('Example app listening on port 3000!'));