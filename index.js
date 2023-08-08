require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

// const userName = "sandbox";
// const apiKey =
// 	"0941db90be408072b1e42740c20badc656fbcdd771bf4a79678e1d3be18c8d88";
// const AT = require("africastalking");
// const africastalking = AT({
// 	apiKey: process.env.AT_API_KEY,
// 	username: process.env.AT_USERNAME,
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

const UssdMenu = require("ussd-menu-builder");
let menu = new UssdMenu();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

let county, region, currentLocation, destination, distance, message, price;
app.post("/api/ussd", (req, res) => {
	menu.startState({
		run: () => {
			menu.con(
				"Welcome to the Trans-E. Please select your county: \n1. Nairobi \n2. Mombasa"
			);
		},
		next: {
			1: "nairobi",
			2: "mombasa",
		},
	});

	menu.state("nairobi", {
		run: () => {
			county = "Nairobi";
			menu.con(
				"Select your region: \n1. Westlands \n2. Langata \n3. Nairobi CBD \n4. Other"
			);
		},
		next: {
			1: "westlands",
			2: "langata",
			3: "cbd",
			4: "other",
		},
	});

	menu.state("westlands", {
		run: () => {
			region = "Westlands";
			menu.end("Westlands is not yet supported. Please try again later.");
		},
	});
	menu.state("langata", {
		run: () => {
			region = "Langata";
			menu.end("Langata is not yet supported. Please try again later.");
		},
	});
	menu.state("cbd", {
		run: () => {
			region = "Nairobi CBD";
			currentLocation = region;
			menu.con("What's you destination: ");
		},
		next: {
			"*[a-zA-Z]+": "cbd.destination",
		},
	});

	menu.state("cbd.destination", {
		run: () => {
			distance = 10;
			price = distance * 20;
			destination = menu.val;
			const currentLocation = region;
			message = `You are coming from ${currentLocation} and going to ${destination}
        Route: via Ngong Road
        Estimated Time: 30 mins
        Estimated Distance: ${distance} km
        Estimated Price: KES ${price}
        
        Go to Kilimani Bus Station take Metro Sacco to South C Main Stage\n`;
			menu.end(
				// "Thank you. Your request has been received. You will receive a route breakdown shortly."
				message
			);
		},
	});

	menu.state("other", {
		run: () => {
			menu.end("Other is not yet supported. Please try again later.");
		},
	});

	menu.state("mombasa", {
		run: () => {
			menu.end("Mombasa is not yet supported. Please try again later.");
		},
	});

	menu.run(req.body, (ussdResult) => {
		console.log("destination is ", destination);

		const to = menu.args.phoneNumber;

		// if (currentLocation != undefined || destination != undefined) {
		// 	sendSMS(message, to);
		// }

		res.send(ussdResult);
	});
});

// const sendSMS = async (txt, destinator) => {

// 	const to = destinator;

// 	try {
// 		const response = await africastalking.SMS.send({
// 			to,
// 			message,
// 		});

// 		console.log(response);
// 	} catch (error) {
// 		console.log(error);
// 	}
// };
app.post("/api/ussd/events", (req, res) => {
	console.log(req.body);
	res.send("Events: " + req.body);
});
