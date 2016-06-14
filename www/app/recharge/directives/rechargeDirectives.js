var rechargeDirectives= angular.module('rechargeDirectives', []);

rechargeDirectives.directive('ignoreNonNumeric', function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).on('keydown', function (event) {
                var key = event.which || event.keyCode;
                if (!event.shiftKey && !event.altKey && !event.ctrlKey &&
                        // numbers
                    key >= 48 && key <= 57 ||
                        // Numeric keypad
                    key >= 96 && key <= 105 ||
                // Backspace and Tab and Enter
                    key == 8 || key == 9 || key == 13 ||
                        // Home and End
                    key == 35 || key == 36 ||
                        // left and right arrows
                    key == 37 || key == 39 ||
                        // Del and Ins
                    key == 46 || key == 45)
                    return true;
                return false;
            });
        }
    }
});

rechargeDirectives.directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return parseFloat(value, 10);
            });
            ngModel.$formatters.push(function(value) {
                return '' + value;
            });
        }
    };
});
