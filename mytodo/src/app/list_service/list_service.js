(function() {
	'use strict';

	angular
	.module('mytodo')
	.factory('ListService', ListService)

	ListService.$inject = ['$log','$http','$q']
	function ListService ($log, $http, $q) {
		var service = {};

		service.getLists = function(boardId) {
			var deferred = $q.defer();
			$http.get('api/lists?boardId=' + boardId)
				.success(function (data){
					deferred.resolve(data);
				})
				.error(function (data){
					deferred.reject('Error: ' + data);
					$log.error('Error: ' +  data);
				});
				return deferred.promise;
		};

		//Create a new list   
		service.createList = function(boardId, formData){
			var deferred = $q.defer();
			$http.post('api/lists/create/' + boardId, formData)
				.success(function (data){
					formData = {};
					deferred.resolve(data);
				})
				.error(function (data){
					deferred.reject('Error: ' + data);
					$log.error('Error: ' +  data);
				});
				return deferred.promise;     
		};

		//Show a list's content
		service.showList = function(id){
			var deferred = $q.defer();
			$http.get('api/list/' + id)
				.success(function (data){
					deferred.resolve(data);
				})
				.error(function (data){
					$log.error('Error: ' +  data);
				});
				return deferred.promise;
		};

		//Delete an existing list  
		service.deleteList = function(id){
			var deferred = $q.defer();
			$http.post('api/lists/delete/' + id)
				.success(function (data){
					deferred.resolve(data);
				})
				.error(function (data){
					deferred.reject('Error: ' + data);
					$log.error('Error: ' +  data);
				});
				return deferred.promise;
		};

		//Update existing list
		service.updateList = function(id, updatedName){
			var deferred = $q.defer();
			$http.post('api/lists/edit/' + id, {name: updatedName})
				.success(function (data){
					deferred.resolve(data);
				})
				.error(function (data){
					deferred.reject('Error: ' + data);
					$log.error('Error: ' +  data);
				});
				return deferred.promise;
		};
		return service;
	}
})();