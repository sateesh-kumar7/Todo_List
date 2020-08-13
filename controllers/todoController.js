var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var List = require("../models/List");

var complete =[];

mongoose.connect('mongodb+srv://test:test@todo.cegag.mongodb.net/todo?retryWrites=true&w=majority', { useNewUrlParser: true });

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

  app.get('/todo', function(req, res) {

    List.find({}, function(err, data){
      if(err) throw err;
      res.render('todo', { todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(req, res){

    var newItem = List(req.body).save(function(err, data){
      if(err) throw err;
      res.render('todo', { todos: data});
    });
  });

  app.delete('/todo/:item', function (req, res) {
    
    List.find({item: req.params.item}).remove(function(err, data){
      if(err) throw err;
      res.send(req.params.item);
    });
  });

};
