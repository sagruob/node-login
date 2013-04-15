
function HomeController()
{

  Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };

	var that = this;
  
  var $topics = $('#topics');

  var socket = io.connect('http://localhost:8080');
  socket.on('topics', function (data) {
    console.log(data);
    var topics = [];
    $topics.find("li").each(function(){ topics.push(this.getAttribute('data-topic')); });
    $.each(data, function() {
      var name = this.name
        , exists = false;
      // remove this one from our list
      topics = $.grep(topics, function(v) {
        exists = true;
        return v != name;
      });
      // update or add
      if(exists){
        $('li[data-topic='+name+'] div span').text(this.users);
      }else{
        $("<li data-topic='"+name+"' class='btn'>"+name+"<div><i class='icon-user'></i><span>"+this.users+"</span></div></li>").click(function(){
          location.href = '/topics/'+name;
        }).appendTo($topics);
      }
    });
    // anything that's left over has to be removed
    $.each(topics, function(k, v){
      $('li[data-topic='+v+']').remove();
    });
  });

}
