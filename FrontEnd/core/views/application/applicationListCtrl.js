(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("ApplicationListCtrl",
                    ["$scope", "$http", "$state", "appSettings", "shareServices", "popupService", "ApplicationServices",
                     ApplicationListCtrl])

    function ApplicationListCtrl($scope, $http, $state, appSettings, shareServices, popupService, ApplicationServices) {
    }
}());