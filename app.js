//Set up server
var express    = require('express');
var methodOverride = require('method-override');
var ejs        = require('ejs');
var app        = express();
var db         = require('./db.js');
var bodyParser = require('body-parser')
// var path       = require('path')
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, "views"))
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


//Listen on port 3000
app.listen(3000);

//Inform about setup when server running
console.log("Running on 3000!");

app.get('/people/new', function(req, res) {
	console.log(req.url)
	res.render('people/new')
});

//Set up routes, requests and responses
app.get('/', function(req, res) {
	//what server does when receives request
	res.render('index');
});

//
app.get('/people', function(req, res) {
	db.query("SELECT * FROM people;", function(err, dbRes) {
		if(!err) {
			res.render('people/index', {people: dbRes.rows});
		}
	});
});



app.get('/people/:id', function(req, res) {
	db.query("SELECT * FROM people WHERE id = $1", [req.params.id], function(err, dbRes) {
		if(!err) {
			res.render('people/show', {person: dbRes.rows[0]});
		}
	})
});

app.post('/people', function(req, res) {
	db.query("INSERT INTO people (name, phone, email) VALUES ($1, $2, $3)", [req.body.name, req.body.phone, req.body.email], function(err, dbRes) {
		if (!err) {
			res.redirect('/people');
		}
	});
});

app.get('/people/:id/edit', function(req, res) {
	db.query("SELECT * FROM people WHERE id = $1", [req.params.id], function(err, dbRes) {
		if(!err) {
			res.render('people/edit', {person: dbRes.rows[0]});
		}
	});
});
//db.query(what you want to query, [elems of array], callback(called once db is done){})

// :D

app.patch('/people/:id', function(req, res) {
	db.query("UPDATE people SET name = $1, phone = $2, email = $3 WHERE id = $4", [req.body.name, req.body.phone, req.body.email, req.params.id], function(err, dbRes) {
		if(!err) {
			res.redirect('/people/' + req.params.id);
		} else {
			res.send(err);
		}
	});
});

app.delete('/people/:id', function(req, res) {
	db.query("DELETE FROM people WHERE id = $1", [req.params.id], function(err, dbRes) {
		if(!err) {
			res.redirect('/people');
		}
	})
});




/*
HTTP Verb | Path | Action
-------------------------
GET   | /people     | index
GET   | /people/new | new
POST  | /people/    | create
GET   | /people/:id/edit | edit
PATCH | /people/:id | update
DELETE| /people/:id | delete
GET   | /people/:id | show

*/





