var app = {
    initialize: function() {
        this.store = new MemoryStore();
		new LoginView(this.store);
    }
	
	

	
};

app.initialize();