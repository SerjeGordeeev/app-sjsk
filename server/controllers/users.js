const mongoose = require('mongoose');
const User = mongoose.model('User');
const Ticket = mongoose.model('Ticket');
const _async = require('async');
const generateLogin = require('password-generator');
const Upload = require('./utils/upload');
const _ = require("lodash");

const await = require('asyncawait/await');
/*const async = require('asyncawait/async');*/

module.exports = {
	getUsers,
	getUser
}

function getUsers(req, res) {
	let workers = null;
	let query = User.find(cleanQueryObj(req.query));
	query.select('name role login phone openPassword email').exec()
		.then((users)=> {
			if(req.query.role === "worker"){
				workers = users;
				return Promise.all(_.map(users, (user) =>{
					return Ticket.find({workerId: user._id})
				}))
			}
			res.status(200);
			res.json(users)
		})
		.then((tickets)=>{
			if (tickets) {
				workers = _.map(workers, (worker,ix)=>{
					worker.ticketsCount = tickets[ix].length
					return worker
				})
				res.status(200);
				res.json(workers)
			}
		})
		.catch(err=> {
			dataError(res, err)
		})
}

function getUser(req, res) {
	let query = User.findById(req.params.id);
	query.exec()
		.then((user)=> {
			res.status(200);
			res.json(user)
		}).catch(err=> {
			dataError(res, err)
		})
}