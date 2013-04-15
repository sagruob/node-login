
function TopicController()
{

  var that = this;
  
  var socket = io.connect('http://localhost:8080');
  
  socket.emit("join", { topic: $('#topic').val() });
  
  $('#request').click(function(){
    socket.emit("request", { test: "ok" });
  });

}
