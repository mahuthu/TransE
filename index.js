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
	// console.log(req.body);
	let { sessionId, serviceCode, phoneNumber, text } = req.body;
	let response = "";
	let county, region, currentLocation, destination, distance, price, count;

	if (text == "") {
		response = `CON Select your county
        1. Nairobi
        2. Mombassa`;
	} else if (text == "1") {
		county = "Nairobi";
		response = `CON Your county is ${county}, Select your region
			1. Eastlands
			2. Westlands
			3. CBD
			4. Others `;
	} else if (text == "2") {
		county = "Mombassa";
		response = `CON Your county is ${county}, Select your region
        1. Changamwe
        2. Likoni
		3. Kisauni
		4. Others `;
	} else if (text == "1*1") {
		region = "Eastlands";
		response = `CON Your current location:`;
	} else if (text == "1*2") {
		region = "Westlands";
		response = `CON Your current location:`;
	} else if (text == "1*3") {
		region = "CBD";
		response = `CON Your current location:`;
	} else if (text == "1*4") {
		region = "Others";
		response = `CON Your current location:`;
	} else if (text == "2*1") {
		region = "Changamwe";
		response = `CON Your current location:`;
	} else if (text == "2*2") {
		region = "Likoni";
		response = `CON Your current location:`;
	} else if (text == "2*3") {
		region = "Kisauni";
		response = `CON Your current location:`;
	} else if (text == "2*4") {
		region = "Others";
		console.log(text);
		response = `CON Your current location:`;
	} else if (count === undefined && text !== "") {
		count = 1;
		currentLocation = text.split("*")[2];
		response = `CON Your destination:`;

		if (count === 1 && currentLocation !== "") {
			count = 2;
			destination = text.split("*")[3];
			distance = 10;
			price = distance * 20;
			response = `END From ${currentLocation} to ${destination}
        Route: via Ngong Road
        Estimated Time: 30 mins
        Estimated Distance: ${distance} km
        Estimated Price: KES ${price}
        
        Go to Kilimani Bus Station take Metro Sacco to South C Main Stage`;
		} else {
			response = `END Invalid input`;
		}
	}

	res.contentType("text/plain");
	res.send(response);
});

app.post("/api/ussd/events", (req, res) => {
	console.log(req.body);
	res.send("Events: " + req.body);
});
