const express = require('express');
const moment = require('moment');
const path = require('path');

const PORT = process.env.PORT || 3000; // if there's no environment variable set to port, use port 3000
const app = express();

app.use(express.static('public'));

function validateDate(input) {
	let dateFormat;

	if (moment(input).isValid()) {
		// unless the date is in unix format, it's considered natural
		dateFormat = 'natural';
	} else if (moment(Number(input)).isValid()) {
		dateFormat = 'unix';
	} else {
		dateFormat = null;
	}

	return getDate(input, dateFormat);
}

function getDate(input, dateFormat) {
	switch (dateFormat) {
		case 'natural':
			return {
				unix: Number(moment(input).format("X")),
				natural: moment(input).format("MMMM DD, YYYY")				
			}
		case 'unix':
			return {
				unix: Number(input),
				natural: moment.unix(Number(input)).format("MMMM DD, YYYY")			
			}
		case null:
			return {
				natural: null,
				unix: null
			}
	}
}

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/:input', function(req, res) {
	// check if date is valid and returns the dates object
	var result = validateDate(req.params.input);

	res.json(result);
});

app.listen(PORT, () => {
	console.log("Server has started...");
});