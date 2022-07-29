const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

var _dbAttempt;
var _dbProduction;

module.exports = {
	connectToServer: function (callback) {
		client.connect(function (err, db) {
			// Verify we got a good "db" object
			if (db) {
				_dbAttempt = db.db("Attempt");
				_dbProduction = db.db("Production");
				console.log("Successfully connected to MongoDB.");
			}
			return callback(err);
		});
	},

	getDbAttempt: function () {
		return _dbAttempt;
	},
	getDbProduction: function () {
		return _dbProduction;
	},
};
