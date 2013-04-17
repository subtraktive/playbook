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
			else{
				//clearDB();
				console.log("whats happening!!!" +collection.find().toArray(function(err, results){
					if(!err){
						console.log("the results length after deletingis " +results.length)
					}
					else{
						console.log("oh fuck this")
					}
				}));
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
};

exports.findById = function(req, res){
	var id = req.params.id;
	db.collection('categories', function(err, collection){
		collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item){
			res.send(item);
		})
	})
}

var categories = [
	{
		name: 'Animals',
		img: 'animals.jpg',
		list: [{name: 'Cat', img: 'cat.jpg'}, {name: 'Dog', img: 'dog.jpg'}]
	},
	{
		name: 'Birds',
		img: 'birds.jpg',
		list: [{name: 'Eagle', img: 'eagle.jpg'}, {name: 'Owl', img: 'owl.jpg'}]
	},
	{
		name: 'Fruits',
		img: 'fruits.jpg',
		list: [{name: 'Apple', img: 'apple.jpg'},{name: 'Cherry', img: 'cherry.jpg'}]
	}];

// var clearDB = function(){
// 	db.categories.remove();
// };

var populateDB = function(){

	console.log("populate db is called")
	
	db.collection('categories', function(err, collection){
		collection.insert(categories, {safe:true}, function(err, result){
			if(err){
				console.log("there was error in inserting")
			}
			else{
				console.log("insertion worked fine " +result)
			}
		})
	})
};