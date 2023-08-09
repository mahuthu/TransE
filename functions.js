const routeData = require("./Nairobi-route-data.json");

// console.log(routeData.routes);

const filterByStopName = (stopName) => {
	stopName = stopName.toLowerCase();
	return routeData.routes.filter((route) => {
		let stops = route.stops.map((stop) => stop.toLowerCase());
		return stops.includes(stopName);
	});
};

isStopFound = (stopName) => {
	return filterByStopName(stopName).length > 0;
};

const getBusPickupPoints = async (stopName) => {
	return filterByStopName(stopName).length > 1
		? // the values adding or in between the values
		  filterByStopName(stopName)
				.map((route) => route.pickup_point)
				.reduce((a, b) => a.concat(b))
		: filterByStopName(stopName).map((route) => route.pickup_point);
};

const getRouteNumbers = async (stopName) => {
	return filterByStopName(stopName).map((route) => route.number);
};

module.exports = {
	// filterByStopName,
	isStopFound,
	getBusPickupPoints,
	getRouteNumbers,
};
