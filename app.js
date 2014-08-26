/**
 * Module dependencies.
 */
var express = require('express'), http = require('http'), path = require('path');
var routes = require('./routes');
var services = require('./routes/services');
var config = require ('./config'); 
var methodOverride = require('method-override');

var app = express();

var engines = require('consolidate');

app.set('views', __dirname + '/views');
/*app.engine('html', engines.mustache);*/


app.configure(function(){
//app.set('port', process.env.PORT || 8000);
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });


app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
//app.set('views', __dirname + '/public');
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(methodOverride());
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public/')));
});

 

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/',function(req,res){
	res.redirect("login.html");
});


app.post('/register', services.register);
app.post('/login', services.login);
app.post('/saveCandidate',services.saveCandidate);
app.post('/uploadcv',services.upload);
app.post('/saveVacancies',services.saveVacancies);
app.post('/solrclient', services.solrclient);
app.get('/getcandidate/:candidate_id',services.getcandidate);

console.log('Express server listening on port '+ config.port);

app.listen(config.port);
