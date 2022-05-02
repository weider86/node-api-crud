const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

require('./models/Article');

const axios = require('axios');

const Article = mongoose.model('article');

const app = express();

app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
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

const getAuthor = async () => {
  return await axios
    .get('https://api.github.com/users/weider86')
    .then((response) => {
      const { data } = response;
      const author = {
        name: data.name,
        login: data.login,
        avatar: data.avatar_url,
        url: data.html_url,
        location: data.location,
        email: data.email,
        bio: data.bio,
        twitter: data.twitter_username,
      };
      return author;
    })
    .catch((error) => {
      return error;
    });
};

// TODO: Separate routes

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

// GET AUTHOR
app.get('/author', async (req, res) => {
  res.json(await getAuthor());
});

app.listen(8080, () => {
  console.log('server initialized at 8080');
});
