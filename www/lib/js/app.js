$( document ).ready(function() {
    $('body').on('click', '.thumbnail', function (event) {
        if(event.target.nodeName != 'INPUT') {
            $(this).find('input[type="radio"]').click().click();
        }
    }).on('change', 'input', function () {
        $("html, body").animate({ scrollTop: $(document).height() }, 'fast');
    }).on('click', '.btn.wifi-settings', function () {
        if (cordova && cordova.plugins.settings) {
            cordova.plugins.settings.open("wifi", function() {
                    // alert('opened settings');
                },
                function () {
                    navigator.notification.alert('Unable to open WiFi Settings!', app.onPrompt, 'Error', 'Ok');
                }
            );
        } else {
            navigator.notification.alert('Plugin is not active!', app.onPrompt, 'Error', 'Ok');
        }
    }).on('click', '.btn.mobile-data-settings', function () {
        if (cordova && cordova.plugins.settings) {
            cordova.plugins.settings.open("data_roaming", function() {
                    // alert('opened settings');
                },
                function () {
                    navigator.notification.alert('Unable to open Data Settings!', app.onPrompt, 'Error', 'Ok');
                }
            );
        } else {
            navigator.notification.alert('Plugin is not active!', app.onPrompt, 'Error', 'Ok');
        }
    });
    $('.navbar a.navbar-link').click(function() {
        var navbar_toggle = $('.navbar-toggle');
        $(this).blur();
        if (navbar_toggle.is(':visible')) {
            navbar_toggle.trigger('click');
        }
    });
    $('.collapse').on('show.bs.collapse', function(){
        $(this).siblings('.navbar-header').find('.fa-bars').toggleClass('fa-bars fa-close')
    }).on('hide.bs.collapse', function(){
        $(this).siblings('.navbar-header').find('.fa-close').toggleClass('fa-bars fa-close');
    });
    $('#networkErrorModal').modal({backdrop: 'static', show: false, keyboard: false, });
});