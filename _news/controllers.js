const mongoose = require('mongoose');
// const { getNewID } = require('../Helpers/newID.js');

const { newSchema } = require('./schema.js');
const News = mongoose.model('News', newSchema);

async function getNews(req, res) {
  await News.find().exec((err, news) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    res.json({
      message: 'Success',
      data: news,
    });
  });
}

async function addNews(req, res) {
  // const _id = await getNewID(News);
  const news = req.body;
  const newNews = new News({ ...news });

  newNews.save(async (err, news) => {
    if (err) {
      res.status(500).json({ message: 'Error occurred', err: err });
      return;
    }
    res.json({
      message: 'News added',
      data: news,
    });
  });
}

async function removeNews(req, res) {
  const _id = req.params.id;
  await News.findOneAndDelete({ _id }).exec((err, pet) => {
    if (err) {
      res.status(500).json({ message: 'Error occured', err: err });
      return;
    }
    res.json({
      message: 'Delete success',
      data: pet,
    });
  });
}

async function updateNews(req, res) {
  const _id = req.params.id;
  const prop = req.body;
  await News.findOneAndUpdate(
    { _id },
    { $set: { ...prop } },
    { returnDocument: 'after' }
  ).exec((err, news) => {
    if (err) {
      res.status(500).json({ message: 'Error occured', err: err });
      return;
    }
    res.json({
      message: 'Update success',
      data: news,
    });
  });
}

async function searchNews(req, res) {
  const docs = await News.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query: req.params.str,
          path: ['text', 'title'],
        },
      },
    },
  ]);
  res.json({ message: 'Search result', data: docs });
}

module.exports = {
  getNews,
  addNews,
  removeNews,
  updateNews,
  searchNews,
};
