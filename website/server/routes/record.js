const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// function getValidatedList(result, keyName) {
// 	// Remove items without title/name
// 	result = result.filter((item) => !(item[keyName] === null));

// 	// Find duplicates and decide
// 	// Group by the name of the key
// 	var groupedByKey = result.reduce(function (reduced, a) {
// 		reduced[a[keyName]] = reduced[a[keyName]] || [];
// 		reduced[a[keyName]].push(a);
// 		return reduced;
// 	}, Object.create(null));

// 	// Filter by number of occurrences for each key
// 	var filtered = Object.keys(groupedByKey).reduce(function (filtered, key) {
// 		// Select first element of list in duplicated items
// 		filtered[key] = groupedByKey[key][0];
// 		return filtered;
// 	}, {});

// 	// Flatten to array of values
// 	var filtered_values = Object.keys(filtered).map(function (key) {
// 		return filtered[key];
// 	});

// 	return filtered_values;
// }

recordRoutes.route("/data/production").get(function (req, res) {
	const dbConnect = dbo.getDb();
	dbConnect
		.collection("Production")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

recordRoutes.route("/data/new").get(function (req, res) {
	let db_connect = dbo.getDb();
	db_connect
		.collection("New")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

module.exports = recordRoutes;
