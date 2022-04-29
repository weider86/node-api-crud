const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('./models/Article');

const Article = mongoose.model('article');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  app.use(cors());
  next();
});

var mongoDB = 'mongodb+srv://weider86:mongo@cluster0.txc3f.mongodb.net/test';
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('successfully connected with mongodb!');
  })
  .catch(() => {
    console.error('!error on conecting with mongodb');
  });

// GET
app.get('/', (req, res) => {
  Article.find({})
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: 'no articles found',
      });
    });
});

// GET BY ID
app.get('/article/:id', (req, res) => {
  Article.findOne({ _id: req.params.id })
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: 'no articles found',
      });
    });
});

// PUT
app.put('/article/:id', (req, res) => {
  const article = Article.updateOne({ _id: req.params.id }, req.body, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: 'error on editing article',
      });
    }

    return res.json({
      error: false,
      message: 'successfully edited article',
    });
  });
});

// DELETE
app.delete('/article/:id', (req, res) => {
  const article = Article.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: 'Error on deleting article',
      });
    }

    return res.json({
      error: false,
      message: 'Successfully deleted article',
    });
  });
});

// POST
app.post('/article', (req, res) => {
  const article = Article.create(req.body, (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: 'Error on creating article',
      });
    }

    return res.json({
      error: false,
      message: 'Successfully created article',
    });
  });
});

app.listen(8080, () => {
  console.log('server initialized at 8080');
});
