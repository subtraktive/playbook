var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('playbook', server, {safe: true});

db.open(function(err, db){
	if(!err){
		console.log("connected to playbook db");
		db.collection('categories', {safe:true}, function(err, collection){
			if(err){
				console.log("the category collection does not exit");
				populateDB();
			}
		});
	}
});

exports.findAll = function(req, res){
	db.collection('categories', function(err, collection){
		collection.find().toArray(function(err, items){
			res.send(items);
		})
	})
}

var populateDB = function(){
	var categories = [
	{
		name: 'Animal'
	},
	{
		name: 'Birds'
	}];

	db.collection('categories', function(err, collection){
		collection.insert(categories, {safe:true}, function(err, result){})
	})
};