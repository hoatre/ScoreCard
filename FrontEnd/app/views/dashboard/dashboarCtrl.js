(function () {
    "use strict";
    angular
        .module("sbAdminApp")
        .controller("DashboardCtrl",
                    ["$scope", "$http", "$state", "$stateParams", "appSettings", "popupService",
                     DashboardCtrl]);

    function DashboardCtrl($scope, $http, $state, $stateParams, appSettings, popupService) {

    }

}());