const mongoose = require('mongoose');
//const { getNewID } = require('../Helpers/newID.js');

const { friendSchema } = require('./schema.js');
const Friends = mongoose.model('Friends', friendSchema);

async function getFriends(req, res) {
  await Friends.find().exec((err, friends) => {
    if (err) {
      res.status(500).json({ message: err });
      return;
    }
    res.json({
      message: 'Success',
      data: friends,
    });
  });
}

async function addFriends(req, res) {
  // const _id = await getNewID(Friends);
  const friendInfo = req.body;
  const newFriend = new Friends({ ...friendInfo });

  newFriend.save(async (err, friend) => {
    if (err) {
      res.status(500).json({ message: 'Error occurred', err: err });
      return;
    }
    res.json({
      message: 'News added',
      data: friend,
    });
  });
}

async function removeFriends(req, res) {
  const _id = req.params.id;
  await Friends.findOneAndDelete({ _id }).exec((err, friend) => {
    if (err) {
      res.status(500).json({ message: 'Error occured', err: err });
      return;
    }
    res.json({
      message: 'Delete success',
      data: friend,
    });
  });
}

async function updateFriends(req, res) {
  const _id = req.params.id;
  const prop = req.body;
  await Friends.findOneAndUpdate(
    { _id },
    { $set: { ...prop } },
    { returnDocument: 'after' }
  ).exec((err, friend) => {
    if (err) {
      res.status(500).json({ message: 'Error occured', err: err });
      return;
    }
    res.json({
      message: 'Update success',
      data: friend,
    });
  });
}

module.exports = {
  getFriends,
  addFriends,
  removeFriends,
  updateFriends,
};
