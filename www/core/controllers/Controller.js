var Controller = {};

Controller.data = {};

Controller.initialize = function() {
	$(window).on('hashchange', $.proxy(Controller.routeHandler, Controller));
}

Controller.routeHandler = function(page, datum) {
	
}

Controller.routeAnchor = function(achorName, page, datum) {
	
}