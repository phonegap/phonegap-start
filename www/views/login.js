var LoginView = function(store) {
    this.initialize = function() {
		$.ajax({
			url:"views/", // relative path to www folder
			type:"get",
			contentType:"application/text",
			context:this,
			success: function(text){
				globals.nativeAlert(text);
			}
		});
	
		$.ajax({
			url:"views/login.html", // relative path to www folder
			type:"get",
			contentType:"application/text",
			context:this,
			success: function(text){
				
				$("body").html(text);
				
				// Define a div wrapper for the view. The div wrapper is used to attach events.
				$('body').on('keyup', '.search-key', this.findByName);
				
			}
		});
		
		this.registerEvents();
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
			
			if (self.iscroll) {
				console.log('Refresh iScroll');
				self.iscroll.refresh();
			} else {
				console.log('New iScroll');
				self.iscroll = new iScroll($('.scroll', self.el)[0], {hScrollbar: false, vScrollbar: false });
			}
			
        });
    };

	this.registerEvents = function() {
		var self = this;
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
		
		$(window).on('hashchange', $.proxy(this.route, this));
	};
	
	this.route = function() {
	
		var detailsURL = /^#employees\/(\d{1,})/;
	
		var hash = window.location.hash;
		if (!hash) {
			new LoginView(store);
			return;
		}
		var match = hash.match(detailsURL);
		if (match) {
			store.findById(Number(match[1]), function(employee) {
				new DetailView(employee);
			});
		}
	};
	
	
    this.initialize();
}