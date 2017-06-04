const mongoose = require('mongoose');

const State = mongoose.model('State');
const Ticket = mongoose.model('Ticket');
const _ = require("lodash")
const moment = require("moment")

module.exports = {
	getStates
}

saveStates();
setInterval(saveStates, 1000 * 60 * 24)

function getStates(req, res) {
	State.find().then(states=>{
			res.status(200);
			res.json(states)
		})
		.catch(err=> {
			dataError(res, err)
		})
}

function saveStates(){
	console.log("***TRY TO SAVE TICKETS STATE*** ",  moment().format("DD.MM.YYYY HH:mm"))
	let newState = new State();

	newState.date = moment().format("DD.MM.YYYY");

	State.find().then(states=>{
		if(_.last(states) && moment(_.get(_.last(states), "date"),"DD.MM.YYYY").isSame(moment(), "day")){
			console.log("***IS SAME DATE***")
			return null
		} else {
			return Ticket.find()
		}
	}).then(tickets=>{
		if(tickets){
			console.log("***SAVING TICKETS STATE***");
			newState.external ={
				newCount: _.filter(tickets, {isExternal:true, status: "new"}).length,
				inProgressCount: _.filter(tickets, {isExternal:true, status: "in_progress"}).length,
				solvedCount: _.filter(tickets, {isExternal:true, status: "solved"}).length,
				lateCount: _.filter(tickets, {isExternal:true, status: "late"}).length
			};

			newState.dispatcher = {
				newCount: _.filter(tickets, {isExternal:false, status: "new"}).length,
				inProgressCount: _.filter(tickets, {isExternal:false, status: "in_progress"}).length,
				solvedCount: _.filter(tickets, {isExternal:false, status: "solved"}).length,
				lateCount: _.filter(tickets, {isExternal:false, status: "late"}).length
			};

			
			newState.save().then(()=>{
				console.log("***TICKETS STATE SAVED***");
			});			
		}
	})
}