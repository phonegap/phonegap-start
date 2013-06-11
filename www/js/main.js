var app = {

    showAlert: function (message, title) {
        if (navigator.notification) {
            navigator.notification.alert(message, null, title, 'OK');
        } else {
            alert(title ? (title + ": " + message) : message);
        }
    },

	initialize: function() {
		$.ajax({
			url:"test.html", // relative path to www folder
			type:"get",
			contentType:"application/text",
			success: function(text){
				alert(text);
			}
		});
	
	
		var self = this;
		this.store = new LocalStorageStore(function() {
			$('body').html(new HomeView(self.store).render().el);
		});
	}

};

app.initialize();