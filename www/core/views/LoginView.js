var LoginView = {};

LoginView.initialize = function(store) {
	LoginView.store = store;
	View.render("LoginView");
	$('body').on('keyup', '.search-key', LoginView.findByName)
	LoginView.registerEvents();
}

LoginView.findByName = function() {
	LoginView.store.findByName($('.search-key').val(), function(employees) {
		var l = employees.length;
		var e;
		$('.employee-list').empty();
		for (var i=0; i<l; i++) {
			e = employees[i];
			$('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
		}
		
		if (LoginView.iscroll) {
			console.log('Refresh iScroll');
			LoginView.iscroll.refresh();
		} else {
			console.log('New iScroll');
			LoginView.iscroll = new iScroll($('.scroll', self.el)[0], {hScrollbar: false, vScrollbar: false });
		}
		
	});
}

LoginView.registerEvents = function() {
	// Check of browser supports touch events...
	if (document.documentElement.hasOwnProperty('ontouchstart')) {
		// ... if yes: register touch event listener to change the "selected" state of the item
		$('body').on('touchstart', 'a', function(event) {
			$(event.target).addClass('tappable-active');
		});
		$('body').on('touchend', 'a', function(event) {
			$(event.target).removeClass('tappable-active');
		});
	} else {
		// ... if not: register mouse events instead
		$('body').on('mousedown', 'a', function(event) {
			$(event.target).addClass('tappable-active');
		});
		$('body').on('mouseup', 'a', function(event) {
			$(event.target).removeClass('tappable-active');
		});
	}
	
	$(window).on('hashchange', $.proxy(LoginView.route, LoginView));
}
	
LoginView.route = function() {

	var detailsURL = /^#employees\/(\d{1,})/;

	var hash = window.location.hash;
	if (!hash) {
		LoginView.initialize(store);
		return;
	}
	var match = hash.match(detailsURL);
	if (match) {
		LoginView.store.findById(Number(match[1]), function(employee) {
			DetailView.initialize(employee);
		});
	}
}
	
