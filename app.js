var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var User = require('./models/User');

mongoose.connect('mongodb+srv://test:test@todo.cegag.mongodb.net/todo?retryWrites=true&w=majority', { useNewUrlParser: true });

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var LocalStrategy = require('passport-local');

app.set('view engine', 'ejs');

app.use(express.static('./public'));

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/todo',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        User.register(new User({ name: req.body.name, username: req.body.email }), req.body.password, function (err, newUser) {
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
})

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
})

function checkAuthenticated(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/todo');
    }
    next();
}

app.post('/todo/check/:item', function (req, res) {

    console.log(req.body.item);
    User.update({ 'list.item': req.params.item }, {
        '$set': { 'list.$.checked': true }
    },
    function (err, updateCollection) {
        res.redirect("/todo");
    })
});

app.get('/todo', checkAuthenticated, function (req, res) {

    User.findOne({ _id: req.user._id }, function (err, data){
        res.render('todo', { todos: data.list });
    });
});

app.post('/todo', urlencodedParser, function (req, res) {

    User.findOneAndUpdate({ _id: req.user._id }, { $push: { list: req.body} }, { new: true },function(err, data){
        if (err) throw err;
        res.render('todo', { todos: data.list });
    })
});

app.delete('/todo/:item', function (req, res) {

    User.findOneAndUpdate({ _id: req.user._id }, { $pull: { 'list': { item: req.params.item } } }, { new: true }, function (err, data) {
        if (err) throw err;
        res.render('todo', { todos: data.list });
    })
});

app.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

var PORT = process.env.PORT || 3000

app.listen(PORT, function(){
    console.log('Todo list server running');
});
