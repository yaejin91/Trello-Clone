var path = require('path'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

//models (this already fetches mongoose through model, no need to call it again)
var Todo = require('../models/todo'),
	List = require('../models/list');

//Index
exports.index = function (req,res){
	var todo = Todo;
	var listId = req.param('listId');
	todo.find({_listid: listId})
		.exec(function (error, data){
			if (data) {
				res.json(data);
			} else if (error) {
				console.error(error.stack);
			}
		})
}

//Create New Todo Item
exports.create = function(req,res){
	var todo = new Todo ({name: req.body.name, _listid: req.params.list_id});
	var listId = req.params.list_id;
	todo.save(function (error,todo) {
		if (todo) {
			List.findOne({_id: listId}, function (err, list){
				if (err) {
					console.log(err);
				} else {
					var id = mongoose.Types.ObjectId(todo._id);
					list.todos.push(id)
					list.save()
					res.json(todo);
				}
			})
		} else if (error) {
			console.error(error.stack);
		}
	})
}

//Update Existing Todo Item
exports.edit = function (req,res){
	var listId = req.params._listid;
	var query = { _id: req.params.todo_id};
	Todo.update(query, {name: req.body.name}, function (error,data){
		Todo.find({ _id: req.params.todo_id}, function (error, todo) {
			res.json(todo);
		})
	})
}

//Destroy Existing Todo Item
exports.destroy = function (req,res){
	var todo = new Todo({_id: req.params.todo_id});
	todo.remove(function (error,data) {
		if (data) {
			res.json(data);
		} else if( error) {
			console.error(error.stack);
		}
	})
}


