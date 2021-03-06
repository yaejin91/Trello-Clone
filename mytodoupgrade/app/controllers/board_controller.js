var path = require('path'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

//models
var Board = require('../models/board'),
	User = require('../models/user');

//Index
exports.index = function (req,res){
	var userId = req.user._id;
	console.log(req.user);
	var board = Board;
	board.find({_userid: userId})
	.sort({ name: 1})
	.populate('lists')
	.exec(function (error, data) {
		if (data) {
			res.json(data);
		} else if (error) {
			console.error(error.stack);
		}
	})
}

//Show Existing Board
exports.show = function (req, res){
	Board.find({_id: req.params.board_id}, function (error,data){
		if (data) {
			res.json(data)
		} else if (error){
			console.error(error.stack);
		}
	})
}

//Create New Board
exports.create = function(req,res){
	var userId = req.user._id;
	var board = new Board ({name: req.body.name, _userid: userId});
	board.save(function (error,data) {
		if (data) {
			User.findOne({_id: userId}, function (err, user){
				if (err) {
					console.log(err);
				} else {
					var id = mongoose.Types.ObjectId(board._id);
					user.boards.push(id);
					user.save();
					//what if error occurs here?
					//change the console logs to message to users
					res.json(data);	
				}
			})
		} else if (error) {
			console.error(error.stack);
		}
	})
}

//Update Existing board
//include error handling
exports.edit = function (req,res){
	var query = { _id: req.params.board_id};
	Board.update(query, {name: req.body.name}, function (error,data){
		Board.find({}, function (error, board) {
			res.json(board);
		})
	})
}

//Invite members to board
exports.inviteUser = function (req,res){
	var boardId = req.params.board_id;
	var memberName = req.body.username;
	var query = {username: memberName};
	User.findOne(query, function (error,invitee){
		if (invitee) {
			invitee.boards.push(boardId);
			invitee.save();
			res.json(invitee);
		} else if (error) {
			console.error(error.stack);
		}
	})
	
}

//Destroy Existing board
exports.destroy = function (req,res){
	var board = new Board({_id: req.params.board_id});
	board.remove(function (error,data) {
		if (data) {
			res.json(data);
		} else if(error) {
			console.error(error.stack);
		}
	})
}
