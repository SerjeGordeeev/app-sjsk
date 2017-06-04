var passport = require('passport')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var generatePassword = require('password-generator');

let sendMail = require('./utils/mailer')

var sendJSONresponse = function (res, status, content) {
	res.status(status)
	res.json(content)
};


module.exports = {
	register,
	login,
	remove,
  	update
}

function register(req, res) {

	var user = new User();

	let password = generatePassword(6, false);
  	let login = generatePassword(6, false);

	user.name = req.body.name;
	user.login = req.body.login || login;
	user.openPassword = password;
	user.role = "worker";
	user.phone = null;

	console.log('Registration', user.name, user.login, password);

	//sendMail(user.email ,password,user) //посылаем данные для входа

	user.setPassword(password);

	user.save()
		.then(()=> {
			var token;
			token = user.generateJwt();
			res.status(200);
			res.json({
				"token": token
			})
		})
		.catch(err=> {
			console.log(err)
			dataError(res, err)
		})

}

function login(req, res) {
	console.log("Auth request")
	if (req.body.id) {
		User.find({_id: mongoose.Types.ObjectId(req.body.id)}, (err, user)=> {
			if (err) dataError(res, err)
			else {
				let token = (new User()).generateJwt.call(user)
				res.status(200)
				res.json({
					"token": token
				})

			}
		})
	} else {
		passport.authenticate('local', function (err, user, info) {
			let token

			// If Passport throws/catches an error
			if (err) {
				res.status(404).json(err)
				return
			}

			// If a user is found
			if (user) {
				token = user.generateJwt()
				res.status(200)
				res.json({
					"token": token
				})
			} else {
				// If user is not found
				res.status(401).json(info)
			}
		})(req, res)
	}

}

function remove(req, res) {

	User.findById(req.params.id).then((user)=> {
		return user.remove()
	}).then(()=> {
		res.status(200);
		res.end();
	}).catch(err => {
		console.log(err)
		res.status(err.status);
		res.end();
	})
}

function update(req, res) {
  console.log("PUT",req.body)
  User.findOneAndUpdate({_id: req.params.id}, req.body, {upsert:true})
  .then((user)=> {
   res.end() 
  })
  .catch(err=>{
    res.status(err.status)
    res.end()
  })

}

/*createUser();
function createUser() {
  var user = new User();

  let password = generatePassword(6, false);

  user.name = "Сергей Сосновский";
  user.login = "admin";
  user.openPassword = password;
  user.role = "admin";
  user.phone = "893788228";

  //sendMail(user.email ,password,user) //посылаем данные для входа

  user.setPassword(password);

  user.save()
}*/