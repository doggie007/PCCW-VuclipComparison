const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;

// function getValidatedList(result, keyName) {
// 	// Remove items without title/name
// 	result = result.filter((item) => !(item[keyName] === null));

// 	// Cleaning data
// 	if (keyName === "title") {
// 		result = result.map((item) => {
// 			// remove <(QA)> from title
// 			if (item[keyName].startsWith("(QA) ")) {
// 				item[keyName] = item[keyName].split("(QA) ").pop();
// 			}
// 			// remove <節目簡介:> from synopsis
// 			if (
// 				item["synopsis"] !== null &&
// 				item["synopsis"].startsWith("節目簡介: ")
// 			) {
// 				item["synopsis"] = item["synopsis"].split("節目簡介: ").pop();
// 			}
// 			return item;
// 		});
// 	}

// 	// Find duplicates and decide
// 	// Group by the name of the key
// 	var groupedByKey = result.reduce(function (reduced, a) {
// 		reduced[a[keyName]] = reduced[a[keyName]] || [];
// 		reduced[a[keyName]].push(a);
// 		return reduced;
// 	}, Object.create(null));

// 	// Filter by number of occurrences for each key
// 	var filtered = Object.keys(groupedByKey).reduce(function (filtered, key) {
// 		// Select last element of list in duplicated items
// 		// Observation from synopsis from other pages are the longer ones
// 		filtered[key] = groupedByKey[key][groupedByKey[key].length - 1];
// 		return filtered;
// 	}, {});

// 	// Flatten to array of values
// 	var filtered_values = Object.keys(filtered).map(function (key) {
// 		return filtered[key];
// 	});

// 	return filtered_values;
// }

// recordRoutes.route("/data/production").get(function (req, res) {
// 	const dbConnect = dbo.getDb();
// 	dbConnect
// 		.collection("Production")
// 		.find({})
// 		.toArray(function (err, result) {
// 			if (err) throw err;
// 			res.json(getValidatedList(result, "name"));
// 		});
// });

// recordRoutes.route("/data/new").get(function (req, res) {
// 	let db_connect = dbo.getDb();
// 	db_connect
// 		.collection("New")
// 		.find({})
// 		.toArray(function (err, result) {
// 			if (err) throw err;
// 			res.json(getValidatedList(result, "title"));
// 		});
// });

// recordRoutes.route("/data/attempt/series").get(function (req, res) {
// 	let db_connect = dbo.getDbAttempt();
// 	db_connect
// 		.collection("Series")
// 		.find({})
// 		.toArray(function (err, result) {
// 			if (err) throw err;
// 			res.json(result);
// 			// res.json(getValidatedList(result, "title"));
// 		});
// });

// function processImgUrls(episodes) {
// 	episodes = episodes.map(function (episode) {
// 		var relativeUrl = episode["cover_img_url"];
// 		console.log(relativeUrl);
// 		var tempUrl = new URL(relativeUrl, "https://www.viu.com");
// 		episode["cover_img_url"] = tempUrl.searchParams.get("img");
// 		return episode;
// 	});
// 	return episodes;
// }

function processSummary(products) {
	return products.map(function (product) {
		if (
			product["summary"] !== null &&
			product["summary"] !== undefined &&
			product["summary"].startsWith("節目簡介: ")
		) {
			product["summary"] = product["summary"].substring(6);
		}
		return product;
	});
}

function processEpisodes(products) {
	return products.map(function (product) {
		if (
			product["episode_details"] !== null &&
			product["episode_details"] !== undefined &&
			product["episode_details"].startsWith("節目簡介: ")
		) {
			product["episode_details"] = product["episode_details"].substring(6);
		}
		return product;
	});
}

recordRoutes.route("/data/new/series").get(function (req, res) {
	let db_connect = dbo.getNewDb();
	db_connect
		.collection("Series")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
		});
});

recordRoutes
	.route("/data/new/:seriesId(\\d+)/episodes")
	.get(function (req, res) {
		var seriesId = parseInt(req.params.seriesId);
		let db_connect = dbo.getNewDb();
		db_connect
			.collection("Episodes")
			.find({ series_id: seriesId })
			.toArray(function (err, result) {
				if (err) throw err;
				res.json(processEpisodes(result));
			});
	});

recordRoutes.route("/data/new/movies").get(function (req, res) {
	let db_connect = dbo.getNewDb();
	db_connect
		.collection("Movies")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(processSummary(result));
		});
});

recordRoutes.route("/data/old/series").get(function (req, res) {
	let db_connect = dbo.getOldDb();
	db_connect
		.collection("Series")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(processSummary(result));
		});
});

recordRoutes.route("/data/old/movies").get(function (req, res) {
	let db_connect = dbo.getOldDb();
	db_connect
		.collection("Movies")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(processSummary(result));
		});
});

recordRoutes
	.route("/data/old/:seriesId(\\d+)/episodes")
	.get(function (req, res) {
		var seriesId = parseInt(req.params.seriesId);
		let db_connect = dbo.getOldDb();
		db_connect
			.collection("Episodes")
			.find({ series_id: seriesId })
			.toArray(function (err, result) {
				if (err) throw err;
				res.json(processEpisodes(result));
			});
	});

module.exports = recordRoutes;
