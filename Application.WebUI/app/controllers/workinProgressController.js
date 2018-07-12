

'use strict';
app.controller('workinProgressController', ['$scope', 'samplesService', 'localStorageService', function ($scope, samplesService, localStorageService) {
    var vm = this;
    vm.samples = [];
   // Functions
    vm.expandAll = expandAll;
    vm.expandAll1 = expandAll1;
    vm.pageChanged = pageChanged;

    //Paging
    vm.totalRecords = 0;
    vm.pageSize = 10;
    vm.currentPage = 1;
    vm.totalPage = 0;
    vm.numberOfPages = 5;
    vm.orderby = "sample";
    vm.reverse = false;
    vm.EndRecord = 0;
    vm.StartsRecods = 0;
    function getSample() {
        var authData = localStorageService.get('authorizationData');
        var companyId = authData.companyId;
        samplesService.getSamplesforwip(companyId, vm.currentPage - 1, vm.pageSize, vm.orderby, vm.reverse).then(function (results) {

            vm.samples = results.data;
            vm.EndRecord = vm.pageSize * ((vm.currentPage - 1) + 1);
            vm.StartsRecods = vm.EndRecord - vm.pageSize;

            if (vm.EndRecord > vm.totalRecords)
                vm.EndRecord = vm.totalRecords;

            vm.StartsRecods = vm.StartsRecods + 1;
            if (vm.EndRecord == 0) vm.EndRecord = vm.totalRecords;
            vm.totalPage = Math.ceil(vm.totalRecords / vm.pageSize);

        }, function (error) {
            //alert(error.data.message);
        });
    }
    
    function init() {
        var authData = localStorageService.get('authorizationData');
        var companyId = authData.companyId;
        samplesService.getSamplesforwipCount(companyId).then(function (results) {

            vm.totalRecords = results.data;

        }, function (error) {
            //alert(error.data.message);
        });
        getSample();
    }
    function pageChanged(page) {
        getSample();
    };
    init();
    function expandAll(expanded) {
        // $scope is required here, hence the injection above, even though we're using "controller as" syntax
        $scope.$broadcast('onExpandAll', { expanded: expanded });
    };
    function expandAll1(expanded1) {
        // $scope is required here, hence the injection above, even though we're using "controller as" syntax
        $scope.$broadcast('onExpandAll', { expanded1: expanded1 });
    };
   
}]);