
var app = angular.module('AngularAuthApp', ['ngRoute', 'ui.bootstrap',  'toastr', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "app/views/sample.html",
        controllerAs: "vm"
    });
    $routeProvider.when("/changePassword", {
        controller: "changePasswordController",
        templateUrl: "app/views/changepassword.html"
    });
    
    $routeProvider.when("/wip", {
        controller: "workinProgressController",
        templateUrl: "app/views/workinProgress.html",
        controllerAs: "vm"
    });
    
    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html"
    });


    $routeProvider.when("/login1", {
        controller: "loginController",
        templateUrl: "app/views/login1.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "app/views/orders.html"
    });

    //$routeProvider.when("/refresh", {
    //    controller: "refreshController",
    //    templateUrl: "app/views/refresh.html"
    //});

    //$routeProvider.when("/tokens", {
    //    controller: "tokensManagerController",
    //    templateUrl: "app/views/tokens.html"
    //});

    //$routeProvider.when("/associate", {
    //    controller: "associateController",
    //    templateUrl: "app/views/associate.html"
    //});

    $routeProvider.otherwise({ redirectTo: "/home" });

});

//var serviceBase = 'http://localhost:32150/';
var serviceBase = '';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

app.directive('expand', function () {
    return {
        restrict: 'A',
        controller: ['$scope', function ($scope) {
            $scope.$on('onExpandAll', function (event, args) {
                $scope.expanded = args.expanded;
            });
            $scope.$on('onExpandAll1', function (event, args) {
                $scope.expanded = args.expanded;
            });
        }]
    };
});
app.directive('expand1', function () {
    return {
        restrict: 'A',
        controller: ['$scope', function ($scope) {
            $scope.$on('onExpandAll', function (event, args) {
                $scope.expanded = args.expanded;
            });
            $scope.$on('onExpandAll1', function (event, args) {
                $scope.expanded = args.expanded;
            });
        }]
    };
});
app.config(['$httpProvider', function ($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);