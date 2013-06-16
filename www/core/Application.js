var App = {};

App.initialize = function() {
	App.store = new MemoryStore();
	Controller.initialize();
	LoginView.initialize(App.store);

}

$(function () {
	App.initialize();
});


