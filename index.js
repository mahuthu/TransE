require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/api/ussd", (req, res) => {
	console.log(req);
	let { sessionId, serviceCode, phoneNumber, text } = req.query;
	let response = "";

	if (text == "") {
		response = `CON What would you like to check
        1. My Account
        2. My phone number`;
	} else if (text == "1") {
		response = `CON Choose account information you want to view
        1. Account number
        2. Account balance`;
	} else if (text == "2") {
		response = `END Your phone number is ${phoneNumber}`;
	} else if (text == "1*1") {
		response = `END Your account number is 1234567890`;
	} else if (text == "1*2") {
		response = `END Your balance is KES 10,000`;
	} else {
		response = `END Invalid choice`;
	}

	res.contentType("text/plain");
	res.send(response);
});
