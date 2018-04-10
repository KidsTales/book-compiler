const express = require('express');
const app = express();


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

app.listen(3000, () => console.log('Example app listening on port 3000!'));