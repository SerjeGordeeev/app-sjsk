const mongoose = require('mongoose');
const Ticket = mongoose.model('Ticket');
const User = mongoose.model('User');
const _async = require('async');
const generateLogin = require('password-generator');
const Upload = require('./utils/upload');

const _ = require("lodash");
const moment = require("moment");

/*const await = require('asyncawait/await');*/
/*const async = require('asyncawait/async');*/

module.exports = {
	getTickets,
	getTicket,
	addTicket,
	removeTicket,
	updateTicket
}

function getTickets(req, res) {
	let query = Ticket.find(cleanQueryObj(req.query));
	
	//_.assign(query, req.params);

	query.exec()
		.then((tickets)=> {
			return assignWorkers(tickets)
		}).then(tickets=>{
			res.status(200);
			res.json(tickets)
		})
		.catch(err=> {
			dataError(res, err)
		})
}

function addTicket(req, res) {
  	var ticket = new Ticket();

  	_.assign(ticket, req.body, {
  		status: "new",
  		createdTime: moment().format("HH:mm"),
  		createdDate: moment().format("DD.MM.YYYY"),
  		closeDate: null,
  		closeTime: null,
  		workerId: null
  	});

  	ticket.save();

	res.json(ticket);
}

function getTicket(req, res) {

	if(mongoose.Types.ObjectId.isValid(req.params.id)){

	let query = Ticket.findById(req.params.id);

	query.exec()
		.then((ticket)=> {
				if(ticket){
					return assignWorkers([ticket]);
				}
				return Promise.reject(new CustomError("Заявка не найдена", 404));
		}).then(tickets=>{
			res.status(200);
			res.json(tickets[0])
		}).catch(err=> {
			console.log(err.respStatusCode)
			res.status(err.respStatusCode);
			res.json({message:err.message})
			//dataError(res, err)
		})
	} else {
		console.warn("Типо неправильный id ", req.params.id)
		res.status(404);
		res.json({message:"Некорректный идентификатор заявки"});
	}
}

function removeTicket(req, res) {

	Ticket.findById(req.params.id).then((ticket)=> {
		return ticket.remove()
	}).then(()=> {
		res.status(200);
		res.end();
	}).catch(err => {
		console.log(err)
		res.status(err.status);
		res.end();
	})
}

function updateTicket(req, res) {
  let resTicket = null;

  console.log(req.body)

  Ticket.findOneAndUpdate({_id: req.params.id}, req.body, {upsert:true}).exec()
  .then((ticket)=> {
   if (ticket.workerId) {
   		console.log(ticket.workerId);
  		User.findById(ticket.workerId).exec().then((worker) => {
  			console.log("Worker", worker);
  			//sendMail(worker, ticket);
  		});
   }
   res.status(200); 
   res.json(ticket);
  })
  .catch(err=>{
  	console.log(err)
  	res.status(505);
    res.json(err);
  })

}

/* * * * * * * * */

function assignWorkers(tickets) {
	//console.log(tickets)
	let workerQuerues = _.map(tickets, ticket => {
		return ticket.workerId? User.findById(ticket.workerId).select("name phone").then(worker => {
			ticket.worker = worker;
		return ticket
		}):ticket;
	})

	return Promise.all(workerQuerues);
}

function CustomError(message, respStatusCode) {
  this.name = "CustomError";
  this.message = message;
  this.respStatusCode = respStatusCode;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

}

CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;