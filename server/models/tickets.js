//const process = require('process')
const mongoose = require('mongoose')

//const MY_SECRET = process.env.SECRET
var messageSchema = new mongoose.Schema({
	authorId: String,
	data: String,
	date: String,
	time: String
})

var ticketSchema = new mongoose.Schema({
	declarantName: String,
	declarantPhone: String,
	description: String,
	workerId: String,
	worker: Object,
	status: String,
	isExternal: Boolean,
	adress: String,
	createdDate: String,
	createdTime: String,
	closeDate: String,
	closeTime: String,
	closedDatePlanned: String,
	closedTimePlanned: String,
	messages: {type: [messageSchema], default: []}
})

ticketSchema.methods.setWorker = function (workerId) {
	this.workerId =  workerId
}

ticketSchema.methods.statusTitle = function () {
	return statusesAssigments[this.status] 
}

const statusesAssigments = {
	in_progress: "В работе",
	new: "Новая",
	solved: "Решена"
}

mongoose.model('Ticket', ticketSchema)
