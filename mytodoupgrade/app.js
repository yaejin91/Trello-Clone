var express = require('express'),
	mongoose = require('mongoose'),
	app = express(),
	bcrypt = require('bcrypt-nodejs'),
	bodyParser = require('body-parser');

//using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//database
mongoose.connect('mongodb://localhost/todos');

//secret variable
app.set('superSecret', 'wlqdprkrhtlvekdndhkdzrnez');

//models
var Todo = require('./app/models/todo'),
	List = require('./app/models/list'),
	Board = require('./app/models/board'),
	User = require('./app/models/user');

//controllers
var TodoController = require('./app/controllers/todo_controller.js'),
	ListController = require('./app/controllers/list_controller.js'),
	BoardController = require('./app/controllers/board_controller.js'),
	UserController = require('./app/controllers/user_controller.js');
	AuthController = require('./app/controllers/authentication_controller.js');

//middleware
var AuthMiddleware = require('./app/middleware/authentication_middleware')
app.use('/api', AuthMiddleware.auth);

//--------------------routes for auth--------------------
//auth and login
app.post('/api/authenticate', AuthController.auth);

//--------------------routes for user--------------------
//index
app.get('/api/users', UserController.index)

//show existing user
app.get('/api/user/:id', UserController.show)

//create new user
app.post('/api/users/create', UserController.create)

//update existing user
app.post('/api/users/edit/', UserController.edit)

//invte non-creator users to board
app.post('/api/user/:member_id/invite/', UserController.inviteUser)

//delete existing user
app.post('/api/users/delete/:id', UserController.destroy)

//--------------------routes for board--------------------
//index
app.get('/api/boards', BoardController.index)

//show existing board
app.get('/api/board/:board_id', BoardController.show)

//create new board
app.post('/api/boards/create/:user_id', BoardController.create)

//update existing board
app.post('/api/boards/edit/:board_id', BoardController.edit)

//invite non-creator users to board
app.post('/api/board/:board_id/invite/', BoardController.inviteUser)

//delete existing board
app.post('/api/boards/delete/:board_id', BoardController.destroy)

//--------------------routes for list--------------------
//index
app.get('/api/lists', ListController.index)

//show existing list
app.get('/api/list/:list_id', ListController.show)

//create new list
app.post('/api/lists/create/:board_id/', ListController.create)

//update existing list
app.post('/api/lists/edit/:list_id', ListController.edit)

//delete existing list
app.post('/api/lists/delete/:list_id', ListController.destroy)

//--------------------routes for todo--------------------
//index
app.get('/api/todos', TodoController.index)

//create new todo item
app.post('/api/todos/:list_id/', TodoController.create)

//update existing todo
app.post('/api/todos/edit/:todo_id', TodoController.edit)

//delete existing todo
app.post('/api/todos/delete/:todo_id', TodoController.destroy)

//--------------------------------------------------------
app.listen(3000);
console.log('Listening to port 3000');

module.exports.app = app;