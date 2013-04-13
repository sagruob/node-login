
function HomeController()
{

// bind event listeners to button clicks //
	var that = this;
  
  var $topics = $('#topics');

  var socket = io.connect('http://localhost:8080');
  socket.on('topics', function (data) {
    $.each(data, function() {
      var name = this.name;
      $("<li data-topic='"+name+"' class='btn'>"+name+"<span><i class='icon-user'></i>"+this.users+"</span></li>").click(function(){
        location.href = '/topics/'+name;
      }).appendTo($topics);
    });
  });

}
