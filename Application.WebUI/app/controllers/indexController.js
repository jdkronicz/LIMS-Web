'use strict';
app.controller('indexController', ['$scope', '$rootScope', '$location', 'authService', 'localStorageService', 'filterFilter', '$routeParams', '$route', function ($scope, $rootScope, $location, authService, localStorageService, filterFilter, $routeParams, $route) {

    $scope.authentication = {
        isAuth: false,
        userName:undefined

    }
    $scope.customers = [];
    $scope.customer = {};
    $scope.logOut = function () {
        authService.logOut();
        $location.path('/login1');
    }
    
    $rootScope.$on("CallCustomer", function () {
        var authData = localStorageService.get('authorizationData');
        $scope.customer =  filterFilter(authData.customers, {custID:authData.companyId})[0];
        $scope.customers = authData.customers;
    });

    $scope.customerChange = function () {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var userName = authData.userName;
        var refreshToken = "";
        var companyId = $scope.customer.custID
        var emailid = authData.emailid;
        var useRefreshTokens = authData.useRefreshTokens;
        var customers = authData.customers;

        //authData.companyId = $scope.customer.custID;
        $scope.customer = filterFilter(authData.customers, { custID: companyId })[0];
        $scope.customers = authData.customers;
        localStorageService.remove('authorizationData');
        localStorageService.set('authorizationData', { token: token, userName: userName, refreshToken: "", companyId: parseInt(companyId), emailid: emailid, useRefreshTokens: false, customers: customers });
        $location.path('/home');
        $route.reload();
    }
    function init() {

        var authData = localStorageService.get('authorizationData');

        if (authService.authentication.isAuth == false)
            $location.path('/login1');
        else {
            $scope.customer = filterFilter(authData.customers, { custID: authData.companyId })[0];
            $scope.customers = authData.customers;
        }

        $scope.authentication = authService.authentication;

    }
    init();

}]);