'use strict';
app.factory('samplesService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var samplesServiceFactory = {};

    var _getSamples = function (searchSample,companyId, currentPage, pageSize, orderby, reverse) {
      
        return $http.get(serviceBase + 'api/Samples',  {
         
            params: { reportNumber: searchSample.reportNumber, product: searchSample.product, subLotNumber: searchSample.subLotNumber, receiptfromDT: searchSample.receiptfromDT, receipttoDT: searchSample.receipttoDT, companyId:companyId,currentPage: currentPage, pageCount: pageSize, sort: orderby, reverse: reverse }
        }).then(function (results) {
            return results;
        });
    };

    samplesServiceFactory.getSamples = _getSamples;

    var _getSamplesforwip = function (companyId, currentPage, pageSize, orderby, reverse) {

        return $http.get(serviceBase + 'api/Samples', {

            params: {companyId: companyId, currentPage: currentPage, pageCount: pageSize, sort: orderby, reverse: reverse }
        }).then(function (results) {
            return results;
        });
    };

    samplesServiceFactory.getSamplesforwip = _getSamplesforwip;

    var _getSamplesforwipCount = function (companyId) {

        return $http.get(serviceBase + 'api/Samples', {

            params: { companyId: companyId }
        }).then(function (results) {
            return results;
        });
    };

    samplesServiceFactory.getSamplesforwipCount = _getSamplesforwipCount;
    var _getSamplesCount = function (searchSample, companyId) {

        return $http.get(serviceBase + 'api/Samples', {

            params: { reportNumber: searchSample.reportNumber, product: searchSample.product, subLotNumber: searchSample.subLotNumber, receiptfromDT: searchSample.receiptfromDT, receipttoDT: searchSample.receipttoDT, companyId: companyId }
        }).then(function (results) {
            return results;
        });
    };

    samplesServiceFactory.getSamplesCount = _getSamplesCount;

    return samplesServiceFactory;

}]);