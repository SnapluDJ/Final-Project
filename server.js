var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var methodOverride = require('method-override');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');


mongoose.connect(configDB.url); 

require('./config/passport')(passport); 

// set up our express application
app.use(morgan('dev')); 
app.use(cookieParser()); 
app.use(bodyParser()); 

app.set('view engine', 'ejs'); 

// required for passport
app.use(session({ secret: 'snaplu' })); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                   
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());


require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

    //AngularJS routes
	var Todo = mongoose.model('Todo', {
	    text: String
	    });
	app.use(express.static(__dirname + '/views'));

	app.get('/api/todos', function (req, res) {
	        Todo.find(function (err, todos) {
	            if (err) {
	                res.send(err);
	            }

	            res.json(todos);
	        });
	    });

    app.post('/api/todos', function (req, res) {
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find(function (err, todos) {
                if (err) {
                    res.send(err);
                }

                res.json(todos);
            });
        });
    });

    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find(function (err, todos) {
                if (err) {
                    res.send(err);
                }

                res.json(todos);
            });
        });
    });


app.listen(port);
console.log('The magic happens on port ' + port);