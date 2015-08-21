(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ApplicationEditCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "ApplicationServices",
                     ApplicationEditCtrl])
    
    function ApplicationEditCtrl($scope, $http, $state, appSettings, shareServices, popupService, ApplicationServices) {
    }
}());