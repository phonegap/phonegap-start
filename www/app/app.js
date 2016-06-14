var webApp= angular.module('webApp', ['ngRoute',
    'rechargeControllers',
    'rechargeFilters',
    'rechargeDirectives',
    'commonServices',
    'LocalStorageModule',
    'cgBusy'
]);

webApp.config(['$routeProvider', 'localStorageServiceProvider', function($routeProvider, localStorageServiceProvider){
    var title = 'کارافون | خدمات آنلاین';
    $routeProvider
        .when('/', {
            title: title,
            templateUrl: 'partials/home.html'
        })
        .when('/recharge', {
            title: title + ' | ' + 'شارژ موبایل',
            templateUrl: 'partials/recharge/recharge-form.html',
            controller: 'RechargeFormCtrl'
        })
        .when('/recharge/requestResult', {
            title: title + ' | ' + 'نتیجه درخواست',
            templateUrl: 'partials/recharge/recharge-result.html',
            controller: 'RechargeResultCtrl'
    });

    localStorageServiceProvider.setStorageType('sessionStorage');
}]);

webApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);

webApp.value('cgBusyDefaults',{
    templateUrl: 'partials/templates/spinner_template.html',
});
