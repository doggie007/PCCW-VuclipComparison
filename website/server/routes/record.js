const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

function getValidatedList(result, keyName) {
	// Remove items without title/name
	result = result.filter((item) => !(item[keyName] === null));

	// Find duplicates and decide
	// Group by the name of the key
	var groupedByKey = result.reduce(function (reduced, a) {
		reduced[a[keyName]] = reduced[a[keyName]] || [];
		reduced[a[keyName]].push(a);
		return reduced;
	}, Object.create(null));

	// Filter by number of occurrences for each key
	var filtered = Object.keys(groupedByKey).reduce(function (filtered, key) {
		// Select first element of list in duplicated items
		filtered[key] = groupedByKey[key][0];
		return filtered;
	}, {});

	// Flatten to array of values
	var filtered_values = Object.keys(filtered).map(function (key) {
		return filtered[key];
	});

	return filtered_values;
}

recordRoutes.route("/data/production").get(function (req, res) {
	let db_connect = dbo.getDb("Viu");
	db_connect
		.collection("Production")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(getValidatedList(result, "name"));
		});
});

recordRoutes.route("/data/new").get(function (req, res) {
	let db_connect = dbo.getDb("Viu");
	db_connect
		.collection("New")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(getValidatedList(result, "title"));
		});
});

// function getUsers(collectionName) {
// 	let db_connect = dbo.getDb("Viu");
// 	db_connect
// 		.collection(collectionName)
// 		.find()
// 		.toArray(function (err, result) {
// 			if (err) {
// 				// Reject the Promise with an error
// 				return reject(err);
// 			}

// 			return result;
// 		});
// }

// recordRoutes.route("/data/combined").get(function (req, res) {
// let db_connect = dbo.getDb("Viu");
// var this.saved = undefined
// db_connect
//     .collection("New")
//     .find({})
//     .toArray()
// 		.collection(collectionName)
// 		.find()
// 		.toArray(function (err, result) {
// 			if (err) {
// 				// Reject the Promise with an error
// 				return reject(err);
// 			}
// 			return result;
// 		});
// var a = getUsers("New");
// var b = a.then(function (resultA) {
// 	return getUsers("Production");
// });
// return Promise.all([a, b]).then(function ([resultA, resultB]) {
// 	let newData = getValidatedList(resultA, "title");
// 	let productionData = getValidatedList(resultB, "name");
// 	// new is smaller
// 	// get matching title/name
// 	// var matchingNewData = newData.filter((itemNew) =>
// 	// 	productionData.some(
// 	// 		(itemProduction) => itemProduction["title"] === itemNew["name"]
// 	// 	)
// 	// );
// 	// // same matching for production data
// 	// var matchingProductionData = matchingProdctionData.filter(
// 	// 	(itemProduction) =>
// 	// 		matchingNewData.some(
// 	// 			(itemNew) => itemProduction["title"] == itemNew["name"]
// 	// 		)
// 	// );
// 	res.json(newData);
// 	// res.json(newData.concat(productionData));
// 	// res.json({
// 	// 	newData: matchingNewData,
// 	// 	productionData: matchingProductionData,
// 	// });
// });
// });

// // This section will help you get a single record by id
// recordRoutes.route("/record/:id").get(function (req, res) {
// 	let db_connect = dbo.getDb();
// 	let myquery = { _id: ObjectId(req.params.id) };
// 	db_connect.collection("records").findOne(myquery, function (err, result) {
// 		if (err) throw err;
// 		res.json(result);
// 	});
// });

// // This section will help you create a new record.
// recordRoutes.route("/record/add").post(function (req, response) {
// 	let db_connect = dbo.getDb();
// 	let myobj = {
// 		name: req.body.name,
// 		position: req.body.position,
// 		level: req.body.level,
// 	};
// 	db_connect.collection("records").insertOne(myobj, function (err, res) {
// 		if (err) throw err;
// 		response.json(res);
// 	});
// });

// // This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
// 	let db_connect = dbo.getDb();
// 	let myquery = { _id: ObjectId(req.params.id) };
// 	let newvalues = {
// 		$set: {
// 			name: req.body.name,
// 			position: req.body.position,
// 			level: req.body.level,
// 		},
// 	};
// });

// // This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {
// 	let db_connect = dbo.getDb();
// 	let myquery = { _id: ObjectId(req.params.id) };
// 	db_connect.collection("records").deleteOne(myquery, function (err, obj) {
// 		if (err) throw err;
// 		console.log("1 document deleted");
// 		response.json(obj);
// 	});
// });

module.exports = recordRoutes;
