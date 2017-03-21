const express  = require('express');

require('./models/db');
require('./config/passport')
require('./controllers/utils/common')


const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static( __dirname + '/client'))

app.use(passport.initialize());
app.use('/api', require('./routes'));


module.exports = app;

let staticRouts = ['auth','sign_in','sign_up','workers']
initStaticRouts(staticRouts)
function initStaticRouts(routs){
	routs.forEach(route =>{
		app.use(`/${route}*`,express.static('client'))
	})
}
