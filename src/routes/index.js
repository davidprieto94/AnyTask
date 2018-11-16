const express = require('express');
const router = express.Router();
const Task = require('../model/task');
const User = require('../model/user');

router.get('/', async (req,res,next) => {
  
  const tasks = await Task.find();
  const users = await User.find();

//var cursor = collection.find(query);

  res.render('index', {tasks, users});
});

router.post('/add', async (req, res, next) => {
  const task = new Task(req.body);
  console.log(task)
  await task.save();
  //console.log(task._id)
  const user = new User(req.body);
  //console.log(user,task._id)
  await user.save();
  res.redirect('/');
});

router.get('/turn/:id', async (req, res,next) => {
  let { id } = req.params;
  const task = await Task.findById(id);
  task.status = !task.status;
  await task.save();
  res.redirect('/');
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
  res.redirect('/');
});

module.exports = router;