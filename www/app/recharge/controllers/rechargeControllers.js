var rechargeControllers= angular.module('rechargeControllers', []);

rechargeControllers.controller('RechargeFormCtrl',
    ['$scope', '$http', 'rechargeTypeConversionService' , 'scrollToBottomService' , 'getProxyBaseUrlService', 'SessionStorageService', 'errorCallbackHandlerService',
        function($scope, $http, rechargeTypeConversionService, scrollToBottomService, getProxyBaseUrlService, SessionStorageService, errorCallbackHandlerService){
    $scope.purchaseInfo= {};
    var checkPhoneNumberValidation=function(phoneNumberValidation){
        if('invalid' !== phoneNumberValidation.type){
            $scope.purchaseInfo['operator']= phoneNumberValidation.type;
            $scope.rechargeTypeVisibility= true;
        }else{
            $scope.phoneNumberValidationErrors= 'شماره نامعتبر است.';
        }
    };
    var getServiceProvider= function(phoneNumber){
        var proxyBaseUrl = getProxyBaseUrlService.process();
        phoneNumber= parseInt('9'+ phoneNumber);
        $scope.phoneNumberPromise = $http.get(proxyBaseUrl + 'recharge/getPhoneNumberType', {params:{"phoneNumber": phoneNumber}}).then(function(response) {
                checkPhoneNumberValidation(response.data);
            },
            function(response){
                $scope.phoneNumberValidationErrors = errorCallbackHandlerService.process(response);
            })
            .then(function(){
                scrollToBottomService.process();
            });
    };
    $scope.getServiceProvider= function(phoneNumber){
        $scope.phoneNumberValidationErrors='';
        $scope.purchaseInfo['rechargeType']= '';
        $scope.purchaseInfo['planType']= '';
        $scope.purchaseInfo['amount']= '';
        $scope.rechargeTypeVisibility= false;
        $scope.hasOtherAmounts= false;
        $scope.paymentVisibility= false;
        $scope.amountValidationErrors= '';
        getServiceProvider(phoneNumber);
    };
    $scope.rechargeTypeClicked= function(){
        $scope.purchaseInfo['planType']= 'prepaid';
        $scope.purchaseInfo['amount']= '';
        $scope.hasOtherAmounts= false;
        $scope.paymentVisibility= false;
        $scope.amountValidationErrors= '';
        if('MTN'==$scope.purchaseInfo['operator']){
            $scope.amounts= {'10,000': 10000, '20,000': 20000, '50,000': 50000};
        }else{
            $scope.amounts= {'10,000': 10000, '20,000': 20000, '50,000': 50000, '100,000': 100000, '200,000': 200000};
        }
    };
    $scope.planTypeClicked= function(){
        $scope.purchaseInfo['amount']= '';
        $scope.purchaseInfo['rechargeType']= '';
        $scope.amountValidationErrors= '';
        $scope.amounts= {};
        $scope.paymentVisibility= false;
    };
    $scope.amountClicked= function(){
        $scope.hasOtherAmounts= false;
        $scope.paymentVisibility= true;
    };
    $scope.otherAmountsClicked= function () {
        $scope.purchaseInfo['amount']= '';
        $scope.paymentVisibility= false;
    };

    var checkAmountRange= function(amountRange, amount){
        var minAmountPerSession= amountRange['min_amount_per_session'];
        var maxAmountPerSession= amountRange['max_amount_per_session'];
        if(amount >= minAmountPerSession && amount <= maxAmountPerSession){
            $scope.paymentVisibility= true;
        }else{
            $scope.amountValidationErrors= ' مبلغ بین محدوده ' + minAmountPerSession + ' و ' + maxAmountPerSession + ' نیست';
        }
    };

    $scope.validateAmount= function(operator, planType, rechargeType, amount){
        $scope.amountValidationErrors='';
        $scope.paymentVisibility= false;
        if('' !== amount && null !== amount && 0 === amount % 1000){
            try {
                var proxyBaseUrl = getProxyBaseUrlService.process(),
                    rechargeTypeId = rechargeTypeConversionService.process(operator, planType, rechargeType);
                $scope.amountPromise = $http.get(proxyBaseUrl + 'recharge/getMinAndMaxForRechargeType', {params:{"rechargeType": rechargeTypeId}})
                    .then(function(response) {
                        checkAmountRange(response.data, amount);
                    },
                    function(response){
                        $scope.amountValidationErrors = errorCallbackHandlerService.process(response);
                    })
                    .then(function(){
                        scrollToBottomService.process();
                    });
            } catch(err) {
                console.error(err);
            }
        }else if('' !== amount && null !== amount && 0 !== amount % 1000){
            $scope.amountValidationErrors= 'مبلغ وارد شده مضربی از 1000 نیست.';
        }else if('' === amount || null === amount){
            $scope.amountValidationErrors= 'مبلغ را وارد نمایید.';
        }

    };
    var getRequestInfo = function(){
        var rechargeTypeId = rechargeTypeConversionService.process($scope.purchaseInfo['operator'], $scope.purchaseInfo['planType'], $scope.purchaseInfo['rechargeType']);
        var info = {
            'phone-number': parseInt('9' + $scope.purchaseInfo['phoneNumber']),
            'recharge-type': rechargeTypeId,
            'amount': $scope.purchaseInfo['amount'],
            'redirect-url': 'http://karafone-app.dev/paymentLanding.php?service=recharge'
        };

        return info;
    };
    var paymentRequest= function(requestParameters){
        $paymentForm = $('<form action="' + requestParameters.url + '" method="' + requestParameters.method + '"></form>');
        $.each(requestParameters.fields, function(name, value) {
            $paymentForm.append('<input type="hidden" name="' + name + '" value="' + value + '"/>');
        });
        $('body').append($paymentForm);
        $paymentForm.submit();
    };
    var paymentProcess= function () {
        var requestInfo= getRequestInfo(),
            proxyBaseUrl = getProxyBaseUrlService.process(),
            $paymentModal = $('#paymentModal');
        $paymentModal.modal({backdrop: 'static', keyboard: false}).modal('show');
        $http.post(proxyBaseUrl + 'recharge/request/new', requestInfo).then(function(response) {
            paymentRequest(response.data['request_parameters']);
        },
        function(response){
            $paymentModal.modal('hide');
            $scope.paymentErrors = errorCallbackHandlerService.process(response);
            scrollToBottomService.process();
        });
    };
    $scope.paymentProcess= function () {
        paymentProcess();
    };
}]);

rechargeControllers.controller('RechargeResultCtrl', ['$scope', '$location', 'SessionStorageService', '$http', 'getProxyBaseUrlService', 'errorCallbackHandlerService', '$interval',
    function($scope, $location, SessionStorageService, $http, getProxyBaseUrlService, errorCallbackHandlerService, $interval){
    var statusRequest = function(proxyBaseUrl, parameters){
        var statusInterval= $interval(function () {
            $scope.statusPromise= $http.get(proxyBaseUrl + 'recharge/request/status', parameters['resNum']).then(function(response) {
                if(false == jQuery.isEmptyObject(response.data)){
                    if ('pending' !== response.data['service']){
                        $interval.cancel(statusInterval)
                    }
                }else{
                    throw 'response data is null!';
                }
            }, function(response){
                $interval.cancel(statusInterval);
                $scope.requestResult = {"payment":"verified","service":"error"};
                $scope.callbackError = errorCallbackHandlerService.process(response);
            });
        }, 2000);
    };
    var finalizeRequest= function (parameters) {
        var requestInfo = {
            'bank-response': JSON.stringify(parameters)
        };
        var proxyBaseUrl = getProxyBaseUrlService.process();
        $scope.finalizePromise= $http.post(proxyBaseUrl + 'recharge/request/finalize', requestInfo).then(function(response) {
            if(false == jQuery.isEmptyObject(response.data)){
                $scope.requestResult = response.data;
                $scope.requestParameters = parameters;
                if ('verified' === response.data['payment']) {
                    statusRequest(proxyBaseUrl, parameters);
                }
            }else {
                throw 'response data is null!';
            }
        }, function(response){
            $scope.requestResult = {'payment': 'error'};
            $scope.callbackError = errorCallbackHandlerService.process(response);
        });
    };
    try{
        var parameters = $location.search();
        if (false == jQuery.isEmptyObject(parameters)){
            finalizeRequest(parameters);
        }else{
            throw 'incomplete bank parameters!';
        }
    }catch(err) {
        console.error(err);
        $scope.requestResult = {'payment': 'error'};
        $scope.callbackError = err;
    }
}]);
