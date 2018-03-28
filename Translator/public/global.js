$(document).ready(function()
{
  $("body").on('click', '.copy', function (elem) {
    var tempVal = $(elem.currentTarget).next();
    tempVal[0].select();
    document.execCommand("Copy");
  });
  $(".urlAtor input").keyup(function (e) {
    var key_code = e.keyCode;
    if ( key_code == 13) {
      var tempUrl = $(".urlAtor input").val();
      $.post( "/getContent",{ url: tempUrl}, function( data ) {
        console.log(data);
        var arrayLength = data.length;
        $(".result").html("");
        data.forEach(function(element) {
          if(element["image"]){
            $(".image").attr( "src",element["image"]);
          }
          else {
            $(".result").append( '<li><p>'+element["text"]+'</p><span class="copy">Copy</span><input type="text" value="'+element["text"]+'"/></li>');
          }
        });
      });
    }
  });
  $.post( "/getContent", function( data ) {
    console.log(data);
    var arrayLength = data.length;
    data.forEach(function(element) {
      if(element["image"]){
        $(".image").attr( "src",element["image"]);
      }
      else {
        $(".result").append( '<li><p>'+element["text"]+'</p><span class="copy">Copy</span><input type="text" value="'+element["text"]+'"/></li>');
      }
    });
  });
});
