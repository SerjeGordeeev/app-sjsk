//const process = require('process')
const mongoose = require('mongoose')


var stateDataSchema = new mongoose.Schema({
	newCount: Number,
	inProgressCount: Number,
	solvedCount: Number,
	lateCount: Number
})

var stateSchema = new mongoose.Schema({
	date: String,
	dispatcher: stateDataSchema,
	external: stateDataSchema
})


mongoose.model('State', stateSchema)
