var storage   = window.localStorage;

var remove = function(name){
  return storage.removeItem(name);
};

var get = function(name){
  return storage.getItem(name);
};

var set = function(name, value){
  storage.setItem(name, value);
};

var is_not_set = function(name){
  return storage.getItem(name) == null;
};

var idea = function(description, next){
  return JSON.stringify({
    description: description,
    next: next
  });
};

var popup=function(msg){
  $("<div class='popup'><h3>"+msg+"</h3></div>").css(
    { display: "block",
      opacity: 0.90, 
      position: "fixed",
      padding: "2px",
      "text-align": "center",
      width: "270px",
      left: ($(window).width() - 284)/2,
      top: $(window).height()/4
  }).appendTo( $.mobile.pageContainer ).delay( 500 ).fadeOut( 300, function(){
      $(this).remove();
    });
};
