/*****************
 * Initial setup *
 *****************/

// It's not Node.js without Over 9000 dependencies
var mongoose = require('mongoose');
var express = require('express');
var app = express();

// Set up the path module for cross-platform paths
var path = require('path');

// Convenience variable for the page root
const staticRoot = path.join(__dirname, 'public');

// Set up Express to use Path
app.use(express.static(staticRoot));

// Use EJS as Express' templating engine
app.set('view engine', 'ejs');

// Specify that EJS templates are in /views
app.set('views', path.join(__dirname, 'views'));

// Set up body-parser for parsing the bodies of POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Page-not-found messages
const pageNotFound = [
    "Nothing to see here. Well, maybe, this message changes.",
    "Yuck! Shoudn't have looked.",
    "That wasn't very gamer epic of you.",
    "Rule #1: You do NOT talk about this page. It's not here.",
    "Now type that in again, but correctly.",
    "Bandwidth is expensive. Don't waste it on wrong URLs."
];

/*************
 * Functions *
 *************/

// Basic random range function adapted from here: https://stackabuse.com/javascript-generate-random-number-in-range/
// Apparently a common function, though- source listed for good measure
function randRange(min, max) {
    var rand = Math.random() * (max - min) + min;
    return Math.floor(rand);
}

/***********
 * MongoDB *
 ***********/

mongoose.connect("mongodb://localhost:27017/UserMessageDB", {
	useNewUrlParser: true,
	useUnifiedTopology :true
});

const userMessageSchema = new mongoose.Schema({
	email: String,
	subject: String,
	message: String
});

var UserMessage = mongoose.model("UserMessage", userMessageSchema);

/**********
 * Routes *
 **********/

app.get('/', function(req, res) {
    res.render('index.ejs', {currentPage: 'home'});
});

app.get('/home', function(req, res) {
    res.redirect('/');
});

app.get('/illus', function(req, res) {
    res.render('illus.ejs', {currentPage: 'illus'});
});

app.get('/code', function(req, res) {
    res.render('code.ejs', {currentPage: 'code'});
});

app.get('/tcg', function(req, res) {
    res.render('tcg', {currentPage: 'tcg'});
});

app.get('/contact', function(req, res) {
    res.render('contact.ejs', {currentPage: 'contact'});
});

// Contact form handling
app.post('/contact', function(req, res) {
	const messengerEmail = req.body.email;
	const messengerSubject = req.body.subject;
	const messengerMessage = req.body.message;
	// There is no need for the checkbox value to be stored.
	// It's marked as required and this POST request wouldn't happen without it being checked.
	// Had they not checked it, the other data wouldn't be present.
	
	const newMessage = {email: messengerEmail, subject: messengerSubject, message: messengerMessage};
	
	const entry = UserMessage.create(newMessage, (err, messageItem) => {
		if (err)
			console.log("/!\\ Something went wrong creating a new contact!");
		else
			res.render('contact-success.ejs', {currentPage: 'contact-success', 
											   email: messageItem.email, 
											   subject: messageItem.subject, 
											   message: messageItem.message});
	});
	
});

// Page not found - THIS SHOULD GO LAST!
app.get("*", function(req, res) {
    res.render("not-found.ejs", {currentPage: 'not-found', remark: pageNotFound[randRange(0, pageNotFound.length)]});
});

/********************
 * Start the server *
 ********************/

app.listen(3000, function() {
    console.log("Server has started");
});