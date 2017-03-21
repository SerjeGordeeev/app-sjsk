const process = require('process')
const app = require('./config')

const port = process.env.PORT || 8228

app.listen(port, function () {
	console.log(`Start server on: ${port}`)
})

app.on('error', err =>{
	console.log('Server error')
	throw err
});
