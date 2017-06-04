const express  = require('express');

require('./models/db');
require('./config/passport')
require('./controllers/utils/common')


const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(passport.initialize());
app.use('/api', require('./routes'));

/*app.use('/', express.static('app_client'))*/

module.exports = app;

/*let staticRouts = ['home','groups','organisations','members','psychologs','auth','props','my_group','admin']
initStaticRouts(staticRouts)
function initStaticRouts(routs){
	routs.forEach(route =>{
		app.use(`/${route}*`,express.static('app_client'))
	})
}*/
