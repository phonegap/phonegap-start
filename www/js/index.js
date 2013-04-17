var storage = window.localStorage;

$( document ).delegate("#login-page", "pageinit", function() {
  $( "#login" ).on( "click", function( event ){
    event.preventDefault();

    $.ajax({
      url:'http://mindsweeper.herokuapp.com/api/login',
      type: "POST",
      data: {username: $( "#username" ).val(), password: $( "#password" ).val()},
      dataType: "json",
      success: function(data, options) {
        for ( property in data._links ) {
          storage.setItem(property, data._links[property].href);
        }

        var ideas = data._embedded.ideas;
        for (var i = 0; i < ideas.length; i++){
          idea_name = 'idea['+i+']';
          idea      = ideas[i];
          console.log(idea);
          storage.setItem(idea_name, idea.description);

          for ( property in idea._links ) {
            storage.setItem(idea_name + '.' + property, idea._links[property].href);
          }
        }
        $.mobile.changePage($("#user-page"));
      },
      error: function() {
        alert("Error");
      }
    });
  });
});

$( document ).delegate("#user-page", "pageinit", function() {
  $('#idea').text(storage.getItem('idea[0]'));
});
