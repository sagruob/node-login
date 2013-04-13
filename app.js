
var express = require('express')
  , http = require('http')
  , app = express()
  , io = require('socket.io')
  , cookie = require('cookie')
  , connect = require('express/node_modules/connect')
  , secret = 'suck-my-butt';

// User interface

    app.configure(function(){
        app.set('port', 8080);
        app.set('views', __dirname + '/app/server/views');
        app.set('view engine', 'jade');
        app.locals.pretty = true;
    //	app.use(express.favicon());
    //	app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.sessionStore = new express.session.MemoryStore({ reapInterval: 60000 * 10 });
        app.use(express.session({ 
          secret: secret,
          store:  this.sessionStore
        }));
        app.use(express.methodOverride());
        app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
        app.use(express.static(__dirname + '/app/public'));
    });

    app.configure('development', function(){
        app.use(express.errorHandler());
    });

    require('./app/server/router')(app);

    var server = http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    })
    
// Socket.io stuff for chat

    var online = {};
    var topics = [
      { name: 'Meeting', users: 34 },
      { name: 'Something', users: 12 },
      { name: 'Test', users: 4 }
    ];

    io.listen(server).set('authorization', function (handshakeData, callback) {

      var cookies = cookie.parse(handshakeData.headers.cookie); 
      var sessionID = connect.utils.parseSignedCookie(cookies['connect.sid'], secret);
      if (!sessionID) {
        callback('No session', false);
      } else {
        handshakeData.sessionID = sessionID;
        app.sessionStore.get(sessionID, function (err, session) {
          if (!err && session && session.user) {
            handshakeData.user = session.user;
            callback(null, true);
          } else {
            callback(err || 'User not authenticated', false);
          }
        });
      }
        
    }).on('connection', function (socket) {
      
        var user = socket.handshake.user
        
        socket.emit('topics', topics);
        
    });

