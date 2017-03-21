//const process = require('process')
const mongoose = require('mongoose')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

//const MY_SECRET = process.env.SECRET

var userSchema = new mongoose.Schema({
	name: {type: String, required: false},
	email: {type: String, required: false},
	login: {type: String, required: false, unique: true},
	openPassword: {type: String, required: false},
	role: {type: String, required: true},
	email: String,
	ticketsCount: Number,
	tickets: Array,
	phone: String,
	hash: String,
	salt: String
})

userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex')
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
}

userSchema.methods.validPassword = function (password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex')
	return this.hash === hash
}

userSchema.methods.generateJwt = function () {
	var expiry = new Date()
	expiry.setDate(expiry.getDate() + 7)

	let token = jwt.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		role: this.role,
		exp: parseInt(expiry.getTime() / 1000),
	}, 'MY_SECRET') // DO NOT KEEP YOUR SECRET IN THE CODE!

	return token
}

userSchema.methods.userData = function () {
	var expiry = new Date()
	expiry.setDate(expiry.getDate() + 7)

	return {
		_id: this._id,
		email: this.email,
		name: this.name,
		role: this.role,
		exp: parseInt(expiry.getTime() / 1000)
	}
}

mongoose.model('User', userSchema)
