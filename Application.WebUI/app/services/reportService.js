'use strict';
app.factory('reportService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var reportServiceFactory = {};

    var _getReport = function (report) {
        return $http({
            url: serviceBase + 'api/Reports',
            method: 'POST',
            responseType: 'arraybuffer',
            data: report

        });
       
    };

    reportServiceFactory.getReport = _getReport;

   

    return reportServiceFactory;

}]);