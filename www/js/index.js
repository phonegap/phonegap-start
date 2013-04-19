$( document ).delegate("#login-page", "pageshow", function() {
  if (is_logged_in()){
    $.mobile.changePage($("#user-page"));
  }

  $( "#login" ).on( "click", function( event ){
    event.preventDefault();
    request({
      type: "POST",
      url: login_url,
      data: login_data,
      success: Mochihua.prototype.login_success,
      error: general_error
    });
    return false;
  });
});

$( document ).delegate("#user-page", "pageshow", function() {
  if (!is_logged_in()) {
    $.mobile.changePage($("#login-page"));
  }

  set_description();
  $('#collect').on('keypress', '#collect-description', function(e) {
    submit_on_return(e);
  });

  $( "#collect-form" ).submit(function( event ){
    request({
      type: "POST",
      url: JSON.parse(storage.getItem('collect')).href,
      data: {description: $( "#collect-description" ).val()},
      success: action_success,
      error: general_error
    });
    $("#collect-description").val("");
    return false;
  });

  $( "#delete" ).click(function( event ){
    $.ajax({
      url: storage.getItem('delete'),
      type: 'DELETE',
      dataType: 'json',
      success: function(data, options) {
        storage.setItem('idea['+current_idea+']', "");
        current_idea = storage.getItem('current-idea');
        current_idea++;
        storage.setItem('current-idea', current_idea);
        idea         = JSON.parse(storage.getItem('idea['+current_idea+']'));

        $('#description').text(idea.description);
        storage.setItem('delete', idea._links.delete.href);
        storage.setItem('review', idea._links.review.href);
        popup(":)");
      },
      error: function() {
        popup(":(");
        console.log("error deleting idea");
      }
    });
    return false;
  });
});
