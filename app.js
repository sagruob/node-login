
var express = require('express')
  , http = require('http')
  , app = express()
  , socket_io = require('socket.io')
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

    var Chat = function(socket){
      
      var that = this;
      
      this.socket = socket;
      this.user = socket.handshake.user;
      
      this.online = {};
      this.topics = [
        { name: 'Meeting', users: -1, waiting: [] },
        { name: 'Something', users: -1, waiting: [] },
        { name: 'Test', users: -1, waiting: [] }
      ];
      
      this.updateTopics = function(){
        // update topics and emit
        var topics = that.topics
          , changed = false;
        for(var key in topics){
            var prev = topics[key]["users"];
            topics[key]["users"] = io.sockets.clients(topics[key]["name"]).length;
            if((prev != topics[key]["users"]) && !changed){
              changed = true
            }
        }
        if(changed){
          io.sockets.emit('topics', topics);
          that.topics = topics;
        }
        
      }
     
      this.addUserToWaiting = function(room){
        for(var key in topics){
          if(topics[key]["name"] == room){
            topics[key]["waiting"].push(user.user);
            return true;
          }
        }
        return false;
      }
      
      this.joinTopic = function(room){
          this.socket.join(room);
          this.updateTopics();
          //todo announce arrival to room
      }
      
      this.leaveTopic = function(room){
          this.socket.leave(room);
          this.updateTopics();
          //todo announce departure to room
      }
      
    }

    var io = socket_io.listen(server);
    io.set('log level', 2);
    
    io.set('authorization', function (handshakeData, callback) {

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
      
        var chat = new Chat(socket);
        var user = socket.handshake.user
        
        chat.updateTopics();
        
        socket.on('join', function (data) {
           chat.joinTopic(data.topic);
        });
        
        socket.on('leave', function (data) {
          chat.leaveTopic(data.topic);
        });
        
        socket.on('request', function(data){
          chat.addUserToWaiting(data.room);
        });
        
    }).on('disconnect', function (socket) {
        
        var chat = new Chat(socket);
        chat.updateTopics();
        
    });
