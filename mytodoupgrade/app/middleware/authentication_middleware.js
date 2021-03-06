var jwt = require('jsonwebtoken'),
	express = require('express'),
	app = require('../../app'),
	bcrypt = require('bcrypt-nodejs');

exports.auth = function (req,res,next) {
	//Refactor so that the code has only one return

	if(req.originalUrl == '/api/users/create'|| req.originalUrl == '/api/authenticate') {
		next();
		return;
	}
	//check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	//decode token
	if(token) {
		// verifies secret and checks exp
		jwt.verify(token, app.app.get('superSecret'), function (err, decoded) {
			if (err) {
				return res.status(422).json({
					success: false,
					message: 'Failed to authenticate token.'
				})
			} else {
				// if everything is good, save to request for use in other routes				
				req.user = decoded;
				next();
			}
		});
	} else {
		//return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
};