const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
const auth = jwt({
	secret: 'MY_SECRET',
	userProperty: 'payload'
})

const authCtrl = require('./controllers/authentication');
const usersCtrl = require('./controllers/users');
const ticketsCtrl = require('./controllers/tickets');
const reportsCtrl = require('./controllers/reports');
const statesCtrl = require('./controllers/states');

router.post('/auth/login', authCtrl.login);
router.post('/users', authCtrl.register);
router.delete('/users/:id', authCtrl.remove);
router.put('/users/:id', authCtrl.update);

router.get('/users', usersCtrl.getUsers);
router.get('/users/:id', usersCtrl.getUser);

router.get('/tickets', ticketsCtrl.getTickets);
router.get('/tickets/:id', ticketsCtrl.getTicket);
router.post('/tickets', ticketsCtrl.addTicket);
router.delete('/tickets/:id', ticketsCtrl.removeTicket);
router.put('/tickets/:id', ticketsCtrl.updateTicket);

router.get('/states', statesCtrl.getStates);

/*Reports*/
router.get('/reports/:report', reportsCtrl.downloadReport);

module.exports = router
