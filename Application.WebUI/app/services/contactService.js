'use strict';
app.factory('contactService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var contactServiceFactory = {};

    var _getcontactsByEmail = function (email) {

     
        return $http.get(serviceBase + 'api/Contacts', {

            params: { email: email }
        }).then(function (results) {
            return results;
        });
    };

    contactServiceFactory.getcontactsByEmail = _getcontactsByEmail;

    return contactServiceFactory;

}]);