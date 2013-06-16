var Controller = {};

Controller.data = [null];

Controller.initialize = function() {
	$(window).on('hashchange', $.proxy(Controller.routeHandler, Controller));
}

Controller.routeHandler = function() {
	var hash = window.location.hash;
	var parts = hash.substring(1, hash.length).split("/");
	var viewName = parts[0];
	var datumId = parts[1];
	
	eval(viewName + ".initialize(Controller.data["+datumId+"]);");
}

Controller.routeAnchor = function(anchorName, viewName, datum) {
	var datumId = 0;
	
	if (datum != null) {
		Controller.data.push(datum);
		datumId = Controller.data.length -1;
	}
	
	var link = "#" + viewName + "/" + datumId;
	$(anchorName).attr("href", link);
}