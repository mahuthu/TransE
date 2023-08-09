require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const AfricasTalking = require("africastalking")({
	apiKey: process.env.AT_API_KEY,
	username: process.env.AT_USERNAME,
});
const {
	// getDestinations,
	isStopFound,
	getBusPickupPoints,
	getRouteNumbers,
	// filterDestinations,
} = require("./functions");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

const UssdMenu = require("ussd-menu-builder");
let menu = new UssdMenu();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

let county,
	region,
	currentLocation,
	destination,
	distance,
	message,
	price,
	routeNumber,
	busPickupPoints;

app.get("/api/routes", (req, res) => {
	res.send(routeData);
});
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
		run: async () => {
			// Make the function asynchronous
			distance = 10;
			price = distance * 20;
			destination = menu.val;

			if (destination != undefined) {
				const currentLocation = region;
				const to = menu.args.phoneNumber;

				if (isStopFound(destination)) {
					try {
						// routeNumber = ;
						// busPickupPoints = ;
						// const busPickupPoints = await getBusPickupPoints(destination);
						// const routeNumber = await getRouteNumbers(destination);

						const message = `You are coming from ${currentLocation} and going to ${destination} 
            Route Numbers: ${await getRouteNumbers(destination)}
            Estimated Time: 30 mins
            Estimated Distance: ${distance} km
            Estimated Price: KES ${price}
            Go to ${await getBusPickupPoints(destination)}\n`;
						const otherMsg = "this is just a test";
						menu.end(message);
						await sendSMS(otherMsg, to);
						if (
							currentLocation != undefined &&
							destination != undefined &&
							distance != undefined &&
							price != undefined &&
							message != undefined &&
							to != undefined
						) {
							await sendSMS(message, to);
						}
					} catch (error) {
						console.error("Error fetching data:", error);
						menu.end(
							"An error occurred while fetching data. Please try again later."
						);
					}
				} else {
					menu.end(
						"We could not find the destination in our database. Please try again later."
					);
				}
			}
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
		if (destination != undefined) console.log("destination is ", destination);

		res.send(ussdResult);
	});
});

const sendSMS = async (txt, destinator) => {
	// console.log("destination is ", destinator);
	// console.log("txt is ", txt);
	// console.log("api key", process.env.AT_API_KEY);
	// console.log("username", process.env.AT_USERNAME);

	// const africastalking = AT({
	// 	apiKey: process.env.AT_API_KEY,
	// 	username: process.env.AT_USERNAME,
	// });

	await AfricasTalking.SMS.send({
		to: destinator,
		message: txt,
	}).catch((err) => {
		console.log(err);
	});
};
// app.post("/api/ussd/events", (req, res) => {
// 	// console.log(req.body.data);
// 	res.send("Events: " + req.body.data);
// });
