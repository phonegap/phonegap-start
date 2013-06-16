var app = {
    initialize: function() {

	

			
		$.ajax({
			url:"views/login.html", // relative path to www folder
			type:"get",
			contentType:"application/text",
			context:this,
			success: function(text){
				globals.nativeAlert(text);
			}
		});
		/*
		
        this.store = new MemoryStore();
		new LoginView(this.store);
		*/
    }
	
	

	
};

app.initialize();