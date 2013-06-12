var LoginView = function(store) {
    this.initialize = function() {
		$.ajax({
			url:"views/login.html", // relative path to www folder
			type:"get",
			contentType:"application/text",
			context:this,
			success: function(text){
				
				$("body").append(text);
				
				// Define a div wrapper for the view. The div wrapper is used to attach events.
				$('body').on('keyup', '.search-key', this.findByName);
			}
		});
    };

    this.render = function() {
        this.el.html(LoginView.template());
        return this;
    };

    this.findByName = function() {
        store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    };

    this.initialize();
}