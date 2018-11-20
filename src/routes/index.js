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

router.post('/filter', async (req, res, next) => {
  const task = new Task(req.body);
  const usuario = new User(req.body);
  var moment = require('moment');
  let perPage = 20;
  let page = req.params.page || 1;
  Task.find({title: {$regex : task.title}})
  .sort({ prioridad: -1 })
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .exec((err, tasks) => {
      Task.count((err, count) => {
        if (err) return next(err);
        User.find({name : {$regex : usuario.name}})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, users) => {
          User.count((err, count) => {
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
    });
});

router.get('/tasks/:page', async (req, res, next) => {
  var moment = require('moment');
  let perPage = 20;
  let page = req.params.page || 1;
  Task.find({})
  .sort({ prioridad: -1 })
  .skip((perPage * page) - perPage)
  .limit(perPage)
  .exec((err, tasks) => {
      Task.count((err, count) => {
        if (err) return next(err);
        User.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec((err, users) => {
          User.count((err, count) => {
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
  res.redirect(req.get('referer'));
});

router.get('/edit/:id/:idu', async (req, res) => {
  const task = await Task.findById(req.params.id);
  const user = await User.findById(req.params.idu);
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