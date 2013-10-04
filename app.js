
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var hue = require('node-hue-api').HueApi;
var user = require('./routes/user');
var projects = require('./routes/projects');
var http = require('http');
var path = require('path');
var Chromath = require('chromath');
var request = require('request');
var key = '&api_key=eAzgLef3CezLbZcDn11bUztYd7XQ3at1';

app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// My stuff
app.set('title', 'AmBehance');
app.set('hue_username', '1bf65ff514536e0e70a846a26cacb459');
app.set('hue_ip', '10.32.81.181');


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);

var server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// app.get('/projects', function(req, res ) {
//   res.send("Hello");
// } );

app.get('/projects', projects.index );

io.sockets.on('connection', function (socket) {

  socket.on('click', function (data) {

    var color = new Chromath(data.color);

    var displayResult = function(result) {
        console.log("RES: " + JSON.stringify(result, null, 2));
    };
    var displayError = function(err) {
        console.error("ERR: " + err);
    };

    var hue = require("node-hue-api"),
        HueApi = hue.HueApi,
        lightState = hue.lightState;

    var api = new HueApi(app.get('hue_ip'), app.get('hue_username')),
        state = lightState.create().on().rgb( color.r, color.g, color.b );

    var url = 'http://www.behance.net/v2/projects?color_range=14&color_hex=' + color.hex().join('') + key;

    request({uri: url}, function(err, response, body) {

      //Just a basic error check
      if(err && response.statusCode !== 200){
        console.log('Request error.');
      }

      api_resp = JSON.parse(response.body);

      api_resp.projects.forEach(function(item){
        socket.emit( 'cover', { 'cover' : ( item.covers['404'] ) ? item.covers['404'] : item.covers['202'] } );
      });

    });

    for (var i=1;i<=3;i++) {
      api.setLightState(i, state)
          .then(displayResult)
          .fail(displayError)
          .done();
    }

  });

});

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
