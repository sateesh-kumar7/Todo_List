var bodyParser = require('body-parser');

let data = [{item: 'get milk'}, {item: 'walk dog'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){

app.get('/todo', function(req, res) {
  res.render('todo', {todos: data});
});

app.post('/todo', urlencodedParser, function(req, res){
  data.push(req.body);
  res.render('todo', { todos: data });

});

app.delete('/todo/:item', function (req, res) {
  
  data = data.filter(e => e.item !== req.params.item);

  res.send(req.params.item);
});

app.put('/todo', function(req, res){

});


};
