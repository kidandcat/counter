const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const helmet = require('helmet');

const PORT = 8000;

const Datastore = require('nedb')
const db = new Datastore({ filename: __dirname + '/database', autoload: true });


app.use(helmet());
app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


db.insert({ _id: 1, hackers: 0 });


app.get('/count', (req, res) => {
  db.find({}, function (err, docs) {
    if(docs){
      res.json({
        hackers: docs[0].hackers
      });
    }else{
      res.json({
        hackers: 0
      });
    }
  });
});

app.post('/new',(req, res) => {
  db.update({ hackers: { $exists: true } }, { $inc: { hackers: 1 } }, function (err, numReplaced, upsert) {
    res.status(200).send();
  });
});


app.use((err, req, res, next) => {
    console.log('ERR', err);
    res.status(err.status || 500);
    res.send('Error ');
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '!');
});
