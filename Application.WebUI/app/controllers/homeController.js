

'use strict';
app.controller('homeController', ['$scope', 'samplesService', 'localStorageService', 'reportService', 'contactService', function ($scope, samplesService, localStorageService, reportService, contactService) {
    var vm = this;
    vm.samples = [];
    vm.contacts = [];
    vm.apply = apply;
    vm.searchSample = {
        reportNumber: "",
        product: "",
        subLotNumber: "",
        receiptfromDT: "",
        receipttoDT:""
    };
    // Functions
    vm.expandAll = expandAll;
    vm.expandAll1 = expandAll1;
    vm.pageChanged = pageChanged;
    vm.search = search;
    vm.download = download;
    vm.reset = reset;
    //Paging
    vm.totalRecords = 0;
    vm.pageSize = 10;
    vm.currentPage = 1;
    vm.totalPage = 0;
    vm.numberOfPages = 5;
    vm.orderby = "sample";
    vm.reverse = false;

    function download(report)
    {
        var newReport = {};
        newReport.ReportID = report.reportID;
        newReport.ReportType = report.reportType;
        reportService.getReport(newReport).then(function (results) {

            var filedata = results.data;
            var file = new Blob([filedata], { type: 'application/pdf', responseType: 'arraybuffer' });

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, report.reportNum + ".pdf");
            }
            else {
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }

        }, function (error) {
            //alert(error.data.message);
        });

           
       
    }

    function reset()
    {
        vm.searchSample.reportNumber= "";
        vm.searchSample.product= "";
        vm.searchSample.subLotNumber= "";
        vm.searchSample.receiptfromDT= "";
        vm.searchSample.receipttoDT= "";
        apply();
    }
    function apply()
    {
        var authData = localStorageService.get('authorizationData');
        var companyId = authData.companyId;

       
            samplesService.getSamplesCount(vm.searchSample, companyId).then(function (results) {

                vm.totalRecords = results.data;
                search();

            });

       
        
        
        $('.date').datepicker({
            autoclose: true,
            format: 'mm/dd/yyyy',
            todayBtn: "linked",
            orientation: "top left"
        });
    }
    function search()
    {
        var authData = localStorageService.get('authorizationData');
        var companyId = authData.companyId;
        samplesService.getSamples(vm.searchSample,companyId, vm.currentPage - 1, vm.pageSize, vm.orderby, vm.reverse).then(function (results) {

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
    function pageChanged(page) {
        search();
    };
    apply();
    function expandAll(expanded) {
        // $scope is required here, hence the injection above, even though we're using "controller as" syntax
        $scope.$broadcast('onExpandAll', { expanded: expanded });
    };
    function expandAll1(expanded1) {
        // $scope is required here, hence the injection above, even though we're using "controller as" syntax
        $scope.$broadcast('onExpandAll', { expanded1: expanded1 });
    };
}]);