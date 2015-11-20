(function() {
	'use strict';

	angular
	.module('mytodo')
	.controller('BoardController', BoardController);

	BoardController.$inject = ['$log','$routeParams','BoardService']
	function BoardController($log, $routeParams, BoardService) {
		var vm = this;
		vm.boards = [];
		vm.formData = {};
		var userId = $routeParams.userId;
		vm.formData._userid = userId;

		//List of Boards (with their userId)
		BoardService.getBoards(userId)
		.then(function (data) {
			vm.boards = data;
		})
		.catch(function (err) {
			$log.debug('Error: ' + err);
		})

		//Create a new Board
		vm.createBoard = function(){
			BoardService.createBoard(vm.formData._userid, vm.formData)
			.then(function (data) {
				vm.boards.push(data);
			})
			.catch(function (err) {
				$log.debug('Error: ' + err);
			})
		};

		//Show a board's content
		vm.showBoard = function(id){
			BoardService.showBoard(id)
			.then(function (data) {
				vm.boards = data;
			})
			.catch(function (err) {
				$log.debug('Error: ' + err);
			})
		};

		//Delete an existing board    
		vm.deleteBoard = function(id){
			BoardService.deleteBoard(id)
			.then(function (data) {
				for (var i = 0; i < vm.boards.length; i++){
					if (vm.boards[i]._id == data._id){
						vm.boards.splice(i, 1);
						break;
					}
				}
			})
			.catch(function (err) {
				$log.debug('Error: ' + err);
			})
		};

		//Update an existing board
		vm.updateBoard = function(id, updatedName){
			BoardService.updateBoard(id, updatedName)
			.then(function () {
				$log.debug('Board name updated to: ', updatedName);
			})
			.catch(function (err) {
				$log.debug('Error: ' + err);
			})
		};
	}
})();