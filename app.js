var express = require('express'),
	path = require('path'),
	http = require('http'),
	category = require('./routes/categories');
	//application_root = __dirname,
	//categories = require('./routes/categories'),
	//mongoose = require('mongoose');



var app = express();


app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.bodyParser());
	app.use(express.logger('dev'));
	app.use(express.static(path.join(__dirname, "public")));
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  //app.set('views', path.join(application_root, "views"));
  //app.set('view engine', 'jade')
});

app.get('/categories', category.findAll);
app.get('/categories/:id', category.findById);

//app.listen(4000);
//console.log("Listening on port 4000");

http.createServer(app).listen(app.get('port'), function(){
	console.log("express server on " +app.get('port'));
})