
function TopicController()
{

  var that = this;

  var topic = $('#topic').val();
  
  var socket = io.connect('http://localhost:8080');
  
  socket.emit('join', { 'topic': topic });
  // after this event, should receive info about the topic (existing chat, waiting list etc)
  
  $('#request').click(function(){
    socket.emit('request', { 'topic': topic } );
  });
  
  socket.on('waiting', function(data){
    newlist = "";
    $.each(data, function(){
      newlist += "<li>"+this+"</li>";
    });
    $('#waiting').empty().append(newlist);
  });

}
