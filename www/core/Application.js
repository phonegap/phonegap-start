var App = {};

App.initialize = function() {
	this.store = new MemoryStore();
	LoginView.initialize(this.store);
}

$(function () {
	App.initialize();
});


