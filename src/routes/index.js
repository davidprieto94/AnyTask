const express = require('express');
const router = express.Router();
const Task = require('../model/task');
const User = require('../model/user');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/add-tasks', (req, res, next) => {
  res.render('tasks/add-tasks');
});

const moment = require('moment');
exports.index = function(req, res) {
    res.render('tasks/tasks', { moment: moment });
}

router.get('/tasks/:page', async (req, res, next) => {
  var moment = require('moment');
  let perPage = 9;
  let page = req.params.page || 1;
  const users = await User.find();
  await Task
    .find({}) // finding all documents
    .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
    .limit(perPage) // output just 9 items
    .exec((err, tasks) => {
      Task.count((err, count) => { // count to calculate the number of pages
        if (err) return next(err);
        res.render('tasks/tasks', {
          tasks,
          users,
          current: page,
          pages: Math.ceil(count / perPage),
          moment : moment
        });
      });
    });
});

router.post('/add', async (req, res, next) => {
  const task = new Task(req.body);
  await task.save();
  const user = new User(req.body);
  await user.save();
  res.redirect('/');
});

router.get('/turn/:id', async (req, res,next) => {
  let { id } = req.params;
  const task = await Task.findById(id);
  task.status = !task.status;
  await task.save();
  res.redirect('back');
});

router.get('/edit/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  const user = await User.find();
  res.render('edit', { task, user});
});

router.post('/edit/:id', async (req, res) => {
  let { id } = req.params;
  const task = await Task.findById(req.params.id);
  await Task.update({_id: id}, req.body);
  await User.update({title: task.title}, req.body);
  res.redirect('/');
});

router.get('/delete/:id', async (req, res) => {
  let { id } = req.params;
  const task = await Task.findById(req.params.id);
  await Task.remove({_id: id});
  await User.remove({title: task.title});
  res.redirect(req.get('referer'));
});

module.exports = router;