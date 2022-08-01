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
				_dbOld = db.db("oldQA");
				_dbNew = db.db("newQA");
				console.log("Successfully connected to MongoDB.");
			}
			return callback(err);
		});
	},

	getOldDb: function () {
		return _dbOld;
	},
	getNewDb: function () {
		return _dbNew;
	},
};
