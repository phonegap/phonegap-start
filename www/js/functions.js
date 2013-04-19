var storage   = window.localStorage;

var login_url   = "http://mindsweeper.herokuapp.com/api/login";
var login_data   = { username: $( "#username" ).val(), password: $( "#password" ).val()};
var collect_data = { description: $( "#collect-description" ).val() };

var Mochihua = function() {};

var store_links = function(links) {
  for ( property in links ) {
    storage.setItem(property, JSON.stringify(links[property]));
  }
};

var store_ideas = function(ideas) {
  for (var i = 0; i < ideas.length; i++){
    storage.setItem('idea['+i+']', JSON.stringify(ideas[i]));
  }
  storage.setItem('current-idea', 0);
  storage.setItem('ideas', ideas.length);
};

Mochihua.prototype.login_success = function(data) {
  store_links(data._links);
  store_ideas(data._embedded.ideas);

  $.mobile.changePage($("#user-page"));
};

var action_success = function(data) {
  ideas = storage.getItem('ideas');
  storage.setItem('idea['+ideas+']', data);
  ideas++;
  storage.setItem('ideas', ideas);
  popup(":)");
};

var is_logged_in = function(){
  return storage.getItem('collect') != null;
};

var get_current_idea = function(){
  current_idea = storage.getItem('current-idea');

  return JSON.parse(storage.getItem('idea['+current_idea+']'));
};

var set_description = function(){
  idea = get_current_idea();

  if (idea) {
    $('#description').text(idea.description);
  }
};

var submit_on_return = function (e) {
  if (e.which == 13) {
    $('#collect-form').submit();
    return false;
  }
};

var request = function(options){
  $.ajax({
    url: options.url,
    type: options.type,
    data: options.data,
    dataType: "json",
    success: options.success,
    error: options.error
  });
};

var general_error = function() {
  popup(":(");
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
