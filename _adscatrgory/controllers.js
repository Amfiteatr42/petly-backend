const mongoose = require('mongoose');

const { categorySchema } = require('./schema.js');
const Category = mongoose.model('AdsCategory', categorySchema);
//const { getNewID } = require ("../Helpers/newID");

async function getAllCategory(req, res) {
  await Category.find().exec((err, categories) => {
    if (err) {
      res.status(500).json({ message: 'Error occured' });
      return;
    }
    res.json({
      message: 'List of category',
      data: categories,
    });
  });
}

async function addCategory(req, res) {
  const { nameCategory } = req.body;
  if (!nameCategory) {
    res.status(400).json({ message: 'Bad request' });
  }
  //const _id = await getNewID(Category);

  const newCategory = new Category({ nameCategory });
  newCategory.save(async (err, category) => {
    if (err) {
      switch (err.code) {
        case 11000:
          res
            .status(400)
            .json({ message: 'Name of category in use', err: err });
          break;

        default:
          res.status(400).json({ message: 'Error occurred', err: err });
          break;
      }
    } else {
      res.json({
        message: 'Category added',
        data: category,
      });
    }
  });
}

async function updateCategory(req, res) {
  const id = req.params.id;
  const prop = req.body;
  Category.findByIdAndUpdate(
    id,
    { $set: { ...prop } },
    { returnDocument: 'after' }
  ).exec((err, category) => {
    if (err) {
      res.status(500).json({ message: 'Error occured' });
      return;
    }
    res.json({
      message: 'Update success',
      data: category,
    });
  });
}

module.exports = {
  getAllCategory,
  addCategory,
  updateCategory,
};
