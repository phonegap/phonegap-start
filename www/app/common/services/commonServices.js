var commonServices = angular.module('commonServices', []);

commonServices.factory('rechargeTypeConversionService', function(){
    var factory= {};
    factory.process= function(operator, planType, rechargeType){
        var number = null;
        if ('MCI'==operator) {
            if ('prepaid'===planType) {
                if ('normal' === rechargeType) {
                    number = 1;
                }
            }
        } else if ('MTN' === operator) {

            if ('prepaid'===planType) {
                if ('normal' === rechargeType) {
                    number = 2;
                } else if ('wow' === rechargeType) {
                    number = 3;
                }
            } else if ('postpaid'===planType) {
                number = 4;
            }
        }

        if (!!number) {
            return number;
        } else {
            throw 'Invalid Recharge Type!';
        }
    };
    return factory;
});

commonServices.factory('scrollToBottomService', function(){
    var factory= {};
    factory.process = function() {
        $("html, body").animate({scrollTop: $(document).height()}, 'fast')
    };
    
    return factory;
});

commonServices.factory('getProxyBaseUrlService', function(){
    var factory= {};
    factory.process = function() {
        return 'http://www.karafone.ir/proxy/';
    };

    return factory;
});

commonServices.factory('SessionStorageService', function(localStorageService) {
    var factory= {};

    factory.getParams = function(key) {
        return localStorageService.get(key);
    };

    factory.setParams = function(key, val) {
        localStorageService.set(key, val);
    };

    factory.getKeys = function() {
        return localStorageService.keys();
    };

    factory.clearAll= function() {
        return localStorageService.clearAll();
    };

    factory.paramsLength= function(){
        return localStorageService.length();
    };

    return factory;

});

commonServices.factory('errorCallbackHandlerService', function(){
    var factory= {};
    factory.process = function(response) {
        var errorMessage= null;
        if (response.data !== null){
            if(400 == response.data.error.code){
                errorMessage = 'اطلاعات نامعتبر است.';
            }else if(500 == response.data.error.code){
                errorMessage = 'خطا در پردازش اطلاعات.';
            } else {
                errorMessage = 'خطای نامشخص.';
            }
        } else {
            errorMessage = 'اشکال در برقراری ارتباط.';
        }

        return errorMessage;
    };

    return factory;
});
